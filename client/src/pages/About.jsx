import React from 'react';
import weplan from '../assets/weplan.jpg';


export default function About() {
  return (
    <div className='py-20 px-4 max-w-6xl mx-auto'>
      <h1 className='text-3xl font-bold mb-4 text-slate-800'>About WePlan</h1>
      {/* <div className='fixed left-[25%] top-[13%] right-[25%] z-10 w-50 h-12 flex justify-center items-center bg-slate-500 cursor-pointer text-3xl font-bold text-blue-700'>
                WePlan - Bringing the world together from experiences!
          </div> */}
      <img 
      src={weplan} alt='bg' className='flex w-full h-full object-cover m-2' />
      
      <p className='mb-4 text-slate-700 italic font-semibold'><span className='font-bold'>WePlan</span> is a leading event management and ticketing eagency that specializes in organizing, hosting, selling events in the nearest places around you. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.</p>
      <p className='mb-4 text-slate-700'>
      Our mission is to help our clients achieve their event goals by providing expert, personalized service, and a deep understanding of the need of market. Whether you are looking to host, organize, or attend an event, we are here to help you every step of the way.
      </p>
      <p className='mb-4 text-slate-700'>WePlan is a global self-service ticketing platform for live experiences that allows anyone to create, share, find and attend events that fuel their passions and enrich their lives. From music festivals, marathons, conferences, community rallies, and fundraisers, to gaming competitions and air guitar contests. Our mission is to bring the world together through live experiences.</p>
    </div>
  )
}
