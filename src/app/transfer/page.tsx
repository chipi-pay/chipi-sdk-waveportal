"use client";

import { useAuth } from '@clerk/nextjs'
import { useTransfer } from "@chipi-pay/chipi-sdk"

export default function TransferComponent() {
    // const { user } = useUser();
  const { getToken } = useAuth();
  // const router = useRouter();
  const { transferAsync } = useTransfer();

  const wallet = {
    publicKey: "0x633e3768....1e",
    encryptedPrivateKey: "U2Fs....595JX7Lu7h5MJnj/Y9RGssgg3j9"
  };

  const handleTransfer = async () => {
   try {
    const token = await getToken({ template: "your-template-name" });
    if (!token) {
      throw new Error("No token found");
    }

    const params: any = {
        encryptKey: "1234", // Encrypt Key como cuarto argumento
        wallet,
        bearerToken: token, // Bearer Token como quinto argumento
        contractAddress: '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8', // USDC contract
        recipient: "0x068456C5e712e43681Ec112b8084A4957Da67E47E13e37db76Ba937Cf1E5E6D0", // Recipient
        amount: "5", // 0.5 jugando con el decimals
        decimals: 5
      };
    const response = await transferAsync({
      ...params
    });
    console.log(response);
   } catch (error) {
    console.error(error);
   }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Transferencia</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <button 
          onClick={handleTransfer}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Transferir
        </button>
      </div>
    </div>
  );
}