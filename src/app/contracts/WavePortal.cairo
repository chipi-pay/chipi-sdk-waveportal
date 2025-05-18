// WavePortal.cairo — Cairo 1  •  Starknet 0.13  •  Scarb 2.11.4

// ─────────────────── public interface ───────────────────
#[starknet::interface]
trait IWavePortal<TState> {
    fn wave(ref self: TState, message: Span<felt252>);
    fn total_waves(self: @TState) -> u128;
}

// ────────────────────── contract ────────────────────────
#[starknet::contract]
mod WavePortal {
    use starknet::{ContractAddress, get_caller_address, get_block_timestamp};
    use core::array::Span;                    // <-- dynamic “slice” type
    use core::integer::u256;
    use openzeppelin::token::erc20::interface::{
        IERC20Dispatcher,
        IERC20DispatcherTrait,                // <- for `.transfer()`
    };

    // ───────── constants
    const MAX_MSG_LEN: usize = 256;
    const PRIZE_LOW:   u128  = 100_000_000_000_000_000_u128;   // 0.1 token

    // ───────── events
    #[derive(Drop, starknet::Event)]
    struct WaveData {
        #[key] from:      ContractAddress,
        timestamp:        u64,
        message:          Span<felt252>,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event { Wave: WaveData }

    // ───────── storage
    #[storage]
    struct Storage {
        seed:         u128,
        total_waves:  u128,
        token_addr:   ContractAddress,
    }

    // ───────── constructor
    #[constructor]
    fn constructor(ref self: ContractState, token_addr: ContractAddress) {
        // init our PRNG seed
        self.seed.write(get_block_timestamp().into() % 100_u128);
        self.token_addr.write(token_addr);
    }

    // ───────── external / view impl
    #[abi(embed_v0)]
    impl Impl of super::IWavePortal<ContractState> {
        fn wave(ref self: ContractState, message: Span<felt252>) {
            // 1️⃣  guard length
            assert(message.len() <= MAX_MSG_LEN, 'Message too long');

            // 2️⃣  bump counter
            self.total_waves.write(self.total_waves.read() + 1);

            // 3️⃣  fresh seed
            let now  = get_block_timestamp();
            let seed = (self.seed.read() + now.into()) % 100_u128;
            self.seed.write(seed);

            // 4️⃣  21% chance to pay out
            if seed < 21_u128 {
                let erc20 = IERC20Dispatcher { contract_address: self.token_addr.read() };
                let amt: u256 = u256 { low: PRIZE_LOW, high: 0 };
                let ok = IERC20DispatcherTrait::transfer(erc20, get_caller_address(), amt);
                assert(ok, 'token transfer failed');
            }

            // 5️⃣  emit event with your raw Span<felt252>
            self.emit(Event::Wave(WaveData {
                from:      get_caller_address(),
                timestamp: now,
                message,
            }));
        }

        fn total_waves(self: @ContractState) -> u128 {
            self.total_waves.read()
        }
    }
}
