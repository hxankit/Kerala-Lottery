import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { lotteryUtils } from '@/lib/lotteryUtils';
// import logowinner from '@/assets/logowinner.png'; // adjust path if needed
import { Trophy, Star } from "lucide-react";

export function Winner() {
  const location = useLocation();

  const [winner, setWinner] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function loadWinner() {
      const searchParams = new URLSearchParams(location.search);
      const phone = searchParams.get('phone');

      if (!phone) {
        setNotFound(true);
        return;
      }

      try {
        setNotFound(false);

        const normalized = lotteryUtils.normalizePhone(phone);

        const response = await fetch(
          `/api/winners/lookup?phone=${encodeURIComponent(normalized)}`
        );

        if (!response.ok) {
          setNotFound(true);
          return;
        }

        const data = await response.json();

        if (!data?.winner) {
          setNotFound(true);
          return;
        }
        console.log(data)
        setWinner(data.winner);
      } catch (error) {
        console.error('Error loading winner:', error);
        setNotFound(true);
      }
    }

    loadWinner();
  }, [location.search]);
  if (!winner) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  }


  function Winners() {
    const winners = [
      {
        title: "1st Winner",
        number: "KL050049",
      },
      {
        title: "2nd Winner",
        number: "KL025584",
      },
      {
        title: "3rd Winner",
        number: "KL468568",
      },
    ];

    return (
      <div className="mx-auto max-w-6xl rounded-[40px] border-2 border-yellow-200 bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-10 shadow-2xl">
        <div className="space-y-8">
          {winners.map((winner) => (
            <div
              key={winner.title}
              className="flex items-center justify-between gap-10"
            >
              {/* Left Box */}
              <div className="flex w-[80%]  items-center justify-center gap-5 rounded-xl bg-[#48ef1f] p-8 shadow-lg">
                <h2 className="text-4xl font-black text-black">
                  {winner.title}
                </h2>

                <Trophy
                  size={30}
                  className="fill-yellow-500 text-yellow-500"
                />
              </div>

              {/* Right Box */}
              <div className="flex  items-center justify-center rounded-xl border-4 border-gray-500 bg-[#f8f2df] p-5 shadow-lg">
                <span className="text-5xl font-black text-black">
                  {winner.number}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-14 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            

            <p className="text-2xl font-black text-black">
              ★ Note : Send Account Details For Transfer Winning Amount.
            </p>
            <p className="text-2xl font-black text-black">
              STHREESAKTHI LOTTERY RESULT 2026 | GOVERNMENT OF KERALA
            </p>
            <p className="text-2xl font-black text-black">
             ★ LOTTERIES RESULT BY KERALA GOVERNMENT ★
            </p>
            
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="  border-2 border-black w-[80%] mx-auto p-5">
      <div className="min-h-screen pt-10 px-2 text-white">

        <div className="flex justify-center mb-8">
          <img
            src="/images/logoWinner.png"
            alt="Winner Logo"
            className="h-[420px] w-auto object-contain"
          />
        </div>


        <div className="text-center">


          <p className="text-5xl font-extrabold text-red-600 uppercase">Congratulations</p>
          <p className="mt-2 text-sm text-black">Your lottery result is here. Check your winning ticket details below.</p>
          <p className="text-2xl font-extrabold text-red-600 mb-4">You Are 5th Winner</p>
        </div>

        {/* <div className="mt-8 rounded-3xl  shadow-lg text-center"> */}
        <p className="text-4xl font-extrabold text-red-600 uppercase text-center">
          {winner?.name}
        </p>

        <p className="mt-2 text-3xl font-bold text-red-600 text-center">
          {winner?.phone}
        </p>

        <p className="mt-2 text-4xl font-extrabold tracking-[0.3em] text-red-600 uppercase text-center">
          {winner?.ticketNumber || "N/A"}
        </p>
        <p className="text-sm text-center mt-3 uppercase tracking-[0.28em] text-black">
          Your Winning
        </p>

        <p className="mt-3 text-4xl text-center text-black font-extrabold bg-gradient-to-b from-[#fed7aa] to-[#fde68a]">
          ₹ 25,00,00,000/-
        </p>

        <p className="mt-2 text-xs mb-6 text-center uppercase tracking-[0.24em] text-black">
          If prize above ₹5 Lakh, Govt. Tax Applicable.
        </p>

        {/* <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button className="inline-flex items-center justify-center rounded-full  px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition hover:opacity-95">
            Check Prize Status
          </button>
          <a
            href="https://api.whatsapp.com/send/?phone=%2B918981866012&text=Hello%20I%20am%20a%20lottery%20winner&type=phone_number&app_absent=0"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:opacity-95"
          >
            WhatsApp Support
          </a>
        </div> */}
        <Winners></Winners>
        <div className="mt-10 space-y-6">
          <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-8">
            <div className="rounded-[24px] bg-gradient-to-r from-orange-300 to-red-500 py-5 text-center">
              <h2 className="text-4xl font-extrabold text-white">
                1st Prize ₹25,00,00,000
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-8 place-items-center">
              {['KL 050049'].map((code) => (
                <div
                  key={code}
                  className="flex h-10 w-45 gap-2 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <span className="text-3xl font-black  text-black">{code}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-8">
            <div className="rounded-[24px] bg-gradient-to-r from-orange-300 to-red-500 py-5 text-center">
              <h2 className="text-4xl font-extrabold text-white">
                2nd Prize ₹10,00,00,000
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-8 place-items-center">
              {['KL 0102445'].map((code) => (
                <div
                  key={code}
                  className="flex h-10 w-45 gap-2 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <span className="text-3xl font-black text-black">{code}</span>
                </div>
              ))}
            </div>

          </div>

          <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-8">
            <div className="rounded-[24px] bg-gradient-to-r from-orange-300 to-red-500 py-5 text-center">
              <h2 className="text-4xl font-extrabold text-white">
                3th Prize ₹75,00,000
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-8 place-items-center">
              {['KL 878788'].map((code) => (
                <div
                  key={code}
                  className="flex h-10 w-45 gap-2 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <span className="text-3xl font-black text-black">{code}</span>
                </div>
              ))}
            </div>

          </div>

          <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-8">
            <div className="rounded-[24px] bg-gradient-to-r orange-300 to-red-500 py-5 text-center">
              <h2 className="text-4xl font-extrabold text-white">
                4th Prize ₹25,00,000
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-8 place-items-center">
              {['KL 002665', 'KL 898226', 'KL 068550', 'KL 092438', 'KL 012587', 'KL 987522', 'KL 145896', 'KL 128796'].map((code) => (
                <div
                  key={code}
                  className="flex h-10 w-45 gap-2 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <span className="text-3xl font-black text-black">{code}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-8">
            <div className="rounded-[24px] bg-gradient-to-r from-orange-300 to-red-500 py-5 text-center">
              <h2 className="text-4xl font-extrabold text-white">
                5th Prize ₹12,00,000
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-8 place-items-center">
              {['KL 468568', 'KL 021856', 'KL 254587', 'KL 021548', 'KL 128564', 'KL 203654', 'KL 333855', 'KL 154788'].map((code) => (
                <div
                  key={code}
                  className="flex h-10 w-45 gap-2 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <span className="text-3xl font-black text-black">{code}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-8">
            <div className="rounded-[24px] bg-gradient-to-r from-orange-300 to-red-500 py-5 text-center">
              <h2 className="text-4xl font-extrabold text-white">
                6th Prize ₹5,00,000
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-8 place-items-center">
              {['KL 000455', 'KL 909990', 'KL 098999', 'KL 111333', 'KL 876787', 'KL 809998', 'KL 787789', 'KL 099990'].map((code) => (
                <div
                  key={code}
                  className="flex h-10 w-45 gap-2 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <span className="text-3xl font-black text-black">{code}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-8">
            <div className="rounded-[24px] bg-gradient-to-r from-orange-300 to-red-500 py-5 text-center">
              <h2 className="text-4xl font-extrabold text-white">
                7th Prize ₹75,000
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-8 place-items-center">
              {['KL 777777', 'KL 098345', 'KL 999000', 'KL 098887', 'KL 099909', 'KL 878666', 'KL 000999'].map((code) => (
                <div
                  key={code}
                  className="flex h-10 w-45 gap-2 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <span className="text-3xl font-black text-black">{code}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mx-auto max-w-4xl rounded-[40px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-8">
            <div className="rounded-[24px] bg-gradient-to-r from-orange-300 to-red-500 py-5 text-center">
              <h2 className="text-4xl font-extrabold text-white">
                8th Prize ₹25,000
              </h2>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-y-8 place-items-center">
              {['KL 909988', 'KL 000090', 'KL 909099', 'KL 787777', 'KL 098989', 'KL 090989', 'KL 908878', 'KL 787790', 'KL 999888', 'KL 898990', 'KL 000989', 'KL 000989'].map((code) => (
                <div
                  key={code}
                  className="flex h-10 w-45 gap-2 items-center justify-center rounded-full bg-white shadow-lg"
                >
                  <span className="text-3xl font-black text-black">{code}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}