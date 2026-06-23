import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { lotteryUtils } from '@/lib/lotteryUtils';
// import logowinner from '@/assets/logowinner.png'; // adjust path if needed
import { Trophy, Star } from "lucide-react";

export function Winner() {
  const location = useLocation();

  const [winner, setWinner] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [OtherWinners, setOtherWinners] = useState([])


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
        setOtherWinners(data.otherFifthTicketNumbers);

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


  const prizeSections = [
    {
      label: '1st Prize',
      amount: '₹25 Cr',
      codes: ['KL 050049'],
    },
    {
      label: '2nd Prize',
      amount: '₹10 Cr',
      codes: ['KL 0102445'],
    },
    {
      label: '3rd Prize',
      amount: '₹75 Lakh',
      codes: ['KL 878788'],
    },
    {
      label: '4th Prize',
      amount: '₹25 Lakh',
      codes: ['KL 002665', 'KL 898226', 'KL 068550', 'KL 092438', 'KL 012587', 'KL 987522', 'KL 145896', 'KL 128796'],
    },
    {
      label: '5th Prize',
      amount: '₹12 Lakh',
      codes: OtherWinners.length ? OtherWinners : ['KL 123456'],
    },
    {
      label: '6th Prize',
      amount: '₹5 Lakh',
      codes: [
        'KL 384721',
        'KL 908154',
        'KL 172639',
        'KL 651802',
        'KL 497315',
        'KL 820946',
        'KL 135784',
        'KL 769251',
        'KL 284690',
        'KL 913578',
        'KL 640127',
        'KL 758394',
        'KL 126845',
        'KL 539718',
        'KL 871263',
        'KL 392056',
        'KL 684175',
        'KL 950432'
      ]
    },
    {
      label: '7th Prize',
      amount: '₹7,500',
      codes: [
        'KL 482916',
        'KL 173548',
        'KL 906234',
        'KL 521897',
        'KL 348761',
        'KL 695142',
        'KL 217983',
        'KL 864305',
        'KL 731256',
        'KL 409872',
        'KL 956138',
        'KL 184629',
        'KL 672451',
        'KL 528364',
        'KL 813907',
        'KL 245786',
        'KL 397124',
        'KL 760519'
      ]
    },
    {
      label: '8th Prize',
      amount: '₹2,500',
      codes: [
        'KL 909988',
        'KL 000090',
        'KL 909099',
        'KL 787777',
        'KL 098989',
        'KL 090989',
        'KL 908878',
        'KL 787790',
        'KL 999888',
        'KL 898990',
        'KL 482731',
        'KL 156904',
        'KL 873625',
        'KL 294518',
        'KL 760183',
        'KL 531846',
        'KL 918274',
        'KL 647395'
      ]
    },
  ];

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
      <div className="mx-auto w-full max-w-6xl rounded-[32px] border border-yellow-200 bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-2 sm:p-4 shadow-2xl">
        <div className="space-y-4">
          {winners.map((winner) => (
            <div
              key={winner.title}
              className="grid gap-3 rounded-3xl bg-white p-3 sm:p-4 shadow-lg sm:grid-cols-[1.8fr_1fr] sm:items-center"
            >
              <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[#48ef1f] p-2 text-center shadow-lg sm:text-left">
                <h2 className="text-1xl sm:text-3xl font-black text-black">
                  {winner.title}
                </h2>
                <Trophy size={24} className="fill-yellow-500 text-yellow-500" />
              </div>

              <div className="flex min-h-[80px] items-center justify-center rounded-xl border-2 border-gray-400 bg-[#f8f2df] p-2 shadow-lg">
                <span className="text-2xl sm:text-3xl font-black text-black">
                  {winner.number}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-10 text-center">
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
    <div className="min-h-screen  bg-slate-50 px-1 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-[32px] border border-slate-200 bg-white p-3 shadow-xl sm:p-5 text-slate-900">

        <div className="flex justify-center mb-6">
          <img
            src="/images/logoWinner.png"
            alt="Winner Logo"
            className="mx-auto w-full max-w-md object-contain"
          />
        </div>


        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-extrabold text-red-600 ">Congratulations</p>
          <p className="mt-3 text-sm sm:text-base text-slate-700">Your lottery result is here. Check your winning ticket details below.</p>
          <p className="mt-3 text-lg sm:text-xl font-extrabold text-red-600">You Are 5th Winner</p>
        </div>

        {/* <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-[32px] bg-amber-100 p-5 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700">Winner Name</p>
            <p className="mt-3 text-lg font-bold text-slate-900">{winner?.name}</p>
          </div>
          <div className="rounded-[32px] bg-amber-100 p-5 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700">Phone</p>
            <p className="mt-3 text-lg font-bold text-slate-900">{winner?.phone}</p>
          </div>
          <div className="rounded-[32px] bg-amber-100 p-5 text-center shadow-sm">
            <p className="text-xs uppercase tracking-[0.24em] text-amber-700">Ticket</p>
            <p className="mt-3 text-lg font-bold text-slate-900">{winner?.ticketNumber || 'N/A'}</p>
          </div>
        </div> */}

        {/* <p className="mt-6 text-center text-xl sm:text-2xl text-black font-extrabold bg-gradient-to-b from-[#fed7aa] to-[#fde68a] py-4 rounded-3xl">
          ₹ 12,00,000/-
        </p> */}
        {/* 
        <p className="mt-3 text-sm text-center uppercase tracking-[0.24em] text-slate-600">
          If prize above ₹5 Lakh, Govt. Tax Applicable.
        </p> */}

        <p className="mt-2 text-5xl sm:text-6xl font-bold text-red-600 text-center leading-tight break-words">
          {winner?.name || "N/A"}
        </p>
        <p className="mt-2 text-2xl sm:text-3xl font-bold text-red-600 text-center break-words">
          {winner?.phone || "N/A"}
        </p>

        <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-red-600 uppercase text-center">
          {winner?.ticketNumber || "N/A"}
        </p>
        <p className="text-sm text-center mt-3 uppercase tracking-[0.24em] text-black">
          Your Winning
        </p>

        <p className="mt-3 text-3xl sm:text-3xl text-center text-black font-extrabold bg-gradient-to-b from-[#fed7aa] to-[#fde68a] py-3 rounded-3xl">
          ₹ 12,00,000/-
        </p>

        <p className="mt-2 text-xs mb-6 text-center uppercase tracking-[0.24em] text-black">
          If prize above ₹5 Lakh, Govt. Tax Applicable.
        </p>

        <Winners></Winners>
        <div className="mt-10">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {prizeSections.map((prize) => (
                <div
                  key={prize.label}
                  className="rounded-[28px] bg-gradient-to-b from-[#fed7aa] to-[#fde68a] p-2 shadow-sm border border-white/20"
                >
                  <div className="rounded-[18px] bg-gradient-to-r from-orange-300 to-red-500 py-2 text-center">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                      {prize.label}
                    </h2>
                    <p className="mt-1 text-sm text-white/80">{prize.amount}</p>
                  </div>

                  <div
                    className={`mt-3 grid gap-2 ${prize.codes.length > 1 ? "grid-cols-3" : "grid-cols-1"
                      }`}
                  >
                    {prize.codes.map((code) => (
                      <div
                        key={code}
                        className="rounded-full bg-white px-3 py-2 text-center text-xs font-bold text-slate-900 shadow-sm"
                      >
                        {code}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}