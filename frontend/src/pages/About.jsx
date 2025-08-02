import React, { useState } from "react";
import { assets } from "../assets/assets";

const About = () => {
  const [activeBox, setActiveBox] = useState(0); 

  return (
    <div>
      <div className="text-center text-2xl pt-10 to-gray-500">
        <p>
          ABOUT <span className="text-gray-700 font-medium">US</span>
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 my-10">
        <img className="w-full max-w-[360px]" src={assets.about_image} alt="" />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm to-gray-600">
          <p>
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology.
          </p>
          <b className="to-gray-800">Our Vision</b>
          <p>
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user.
          </p>
        </div>
      </div>
      
      <div className="text-left my-4">
        <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
      </div>
      
      <div className="flex flex-col md:flex-row mb-20">
        {/* Box 1 */}
        <div 
          className={`border px-10 py-8 flex flex-col gap-5 cursor-pointer transition-all duration-300 ${
            activeBox === 1 ? 'bg-[#5f6FFF] text-white' : 'hover:bg-[#5f6FFF] hover:text-white'
          }`}
          onClick={() => setActiveBox(1)}
        >
          <b>EFFICIENCY:</b>
          <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
        </div>
        
        {/* Box 2 */}
        <div 
          className={`border px-10 py-8 flex flex-col gap-5 cursor-pointer transition-all duration-300 ${
            activeBox === 2 ? 'bg-[#5f6FFF] text-white' : 'hover:bg-[#5f6FFF] hover:text-white'
          }`}
          onClick={() => setActiveBox(2)}
        >
          <b>CONVENIENCE:</b>
          <p>Access to a network of trusted healthcare professionals in your area.</p>
        </div>
        
        {/* Box 3 */}
        <div 
          className={`border px-10 py-8 flex flex-col gap-5 cursor-pointer transition-all duration-300 ${
            activeBox === 3 ? 'bg-[#5f6FFF] text-white' : 'hover:bg-[#5f6FFF] hover:text-white'
          }`}
          onClick={() => setActiveBox(3)}
        >
          <b>PERSONALIZATION:</b>
          <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
        </div>
      </div>
    </div>
  );
};

export default About;