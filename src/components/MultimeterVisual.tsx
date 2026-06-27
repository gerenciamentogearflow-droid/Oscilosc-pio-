import React from 'react';
import { motion } from 'motion/react';

interface MultimeterVisualProps {
  setting: string;
  displayValue?: string | number;
}

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

export function MultimeterVisual({ setting, displayValue }: MultimeterVisualProps) {
  const getDialAngle = (s: string) => {
    switch (s) {
      case 'OFF': return 0;
      case 'ACV_750': return 25;
      case 'ACV_200': return 48;
      case 'DCA_200u': return 75;
      case 'DCA_2000u': return 95;
      case 'DCA_20m': return 112;
      case 'DCA_200m': return 130;
      case 'DCA_10A': return 150;
      case 'hFE': return 170;
      case 'DIODE': return 190;
      case 'OHM_200': return 205;
      case 'OHM_2000': return 220;
      case 'OHM_20k': return 238;
      case 'OHM_200k': return 255;
      case 'OHM_2000k': return 272;
      case 'DCV_200m': return 288;
      case 'DCV_2000m': return 302;
      case 'DCV_20': return 316;
      case 'DCV_200': return 330;
      case 'DCV_1000': return 344;
      default: return 0;
    }
  };

  const angle = getDialAngle(setting);
  
  const getDisplayText = (s: string) => {
    if (displayValue !== undefined) return String(displayValue);
    if (s === 'OFF') return '';
    if (s.startsWith('OHM')) return '1 .   ';
    if (s.startsWith('DCV_20') && s !== 'DCV_200m' && s !== 'DCV_2000m') return '12.00';
    if (s.startsWith('DCV')) return '0.00';
    if (s.startsWith('ACV')) return '00.0';
    return '0.00';
  };

  const is10A = setting === 'DCA_10A';
  const hasPower = setting !== 'OFF';

  const Label = ({ a, text, r = 78, className = "", style = {} }: { a: number, text: React.ReactNode, r?: number, className?: string, style?: any }) => {
    const rad = (a - 90) * Math.PI / 180;
    const left = 50 + (r / 2) * Math.cos(rad);
    const top = 50 + (r / 2) * Math.sin(rad);
    return (
      <div 
        className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-bold whitespace-nowrap leading-none ${className}`}
        style={{ 
          left: `${left}%`,
          top: `${top}%`,
          ...style
        }}
      >
        {text}
      </div>
    );
  };

  const Probe = ({ color }: { color: 'black' | 'red' }) => {
    const isBlack = color === 'black';
    return (
      <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none flex flex-col items-center">
        {/* Plug body */}
        <div className={`w-[22px] h-14 ${isBlack ? 'bg-[#2a2d2f]' : 'bg-red-600'} rounded-t-full shadow-[0_4px_10px_rgba(0,0,0,0.9)] border border-black relative flex justify-center -mt-[2px]`}>
           <div className="w-full h-2 mt-4 flex flex-col gap-[2px]">
             <div className="w-full h-[1px] bg-black opacity-40"></div>
             <div className="w-full h-[1px] bg-black opacity-40"></div>
             <div className="w-full h-[1px] bg-black opacity-40"></div>
           </div>
        </div>
        {/* Strain relief */}
        <div className={`w-[14px] h-6 ${isBlack ? 'bg-[#151718]' : 'bg-red-800'} -mt-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] border-x border-black z-10 flex flex-col items-center justify-evenly`}>
            <div className="w-full h-[1px] bg-black opacity-60"></div>
            <div className="w-full h-[1px] bg-black opacity-60"></div>
        </div>
        {/* Wire */}
        <div className={`w-[8px] h-32 ${isBlack ? 'bg-[#050505]' : 'bg-red-950'} -mt-1 shadow-[inset_0_0_4px_rgba(0,0,0,1)] border-x border-black z-0`}></div>
      </div>
    );
  };

  return (
    <div className="relative w-80 pb-8 bg-[#1a1c1d] rounded-xl border-[6px] border-[#111] shadow-2xl flex flex-col items-center p-4 select-none overflow-hidden mx-auto font-sans">
      
      {/* Grooves for design */}
      <div className="w-full flex justify-between px-4 mb-6">
        <div className="w-[22%] h-1 border-b-[3px] border-[#0a0a0a] rounded-full" />
        <div className="w-[22%] h-1 border-b-[3px] border-[#0a0a0a] rounded-full" />
        <div className="w-[22%] h-1 border-b-[3px] border-[#0a0a0a] rounded-full" />
      </div>

      {/* Screen area */}
      <div className="w-full h-24 bg-[#0a0a0a] rounded-lg p-2.5 shadow-inner flex items-center justify-center mb-4 relative border-b border-[#222]">
        <div className="absolute inset-x-2.5 top-2.5 h-3 bg-black/50 rounded-t" />
        <div className="w-full h-full bg-[#9dae93] rounded border-2 border-[#5a6a5a] flex items-center justify-end px-5 font-mono text-[3.8rem] leading-none text-[#181a18] shadow-[inset_0_3px_10px_rgba(0,0,0,0.6)] tracking-widest relative overflow-hidden"
             style={{ textShadow: "1px 1px 0px rgba(0,0,0,0.1), -1px -1px 0px rgba(255,255,255,0.2)" }}>
          {hasPower && (
            <>
              {setting.startsWith('DCV') || setting.startsWith('ACV') ? <span className="absolute left-5 top-1/2 -translate-y-1/2 text-[3rem]">-</span> : null}
              {getDisplayText(setting)}
            </>
          )}
        </div>
      </div>

      {/* Main Dial Area */}
      <div className="relative w-full aspect-square mt-2 flex-shrink-0">
        {/* SVG Arcs */}
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0">
          <circle cx="100" cy="100" r="36" fill="none" stroke="#111" strokeWidth="4" />
          
          {/* DCV Arc */}
          <path d={describeArc(100, 100, 72, 282, 350)} fill="none" stroke="#ffffff" strokeWidth="2.5" />
          {/* ACV Arc */}
          <path d={describeArc(100, 100, 72, 15, 55)} fill="none" stroke="#ffffff" strokeWidth="2.5" />
          {/* DCA Arc */}
          <path d={describeArc(100, 100, 72, 65, 158)} fill="none" stroke="#ffffff" strokeWidth="2.5" />
          {/* OHM Arc */}
          <path d={describeArc(100, 100, 72, 198, 278)} fill="none" stroke="#4ade80" strokeWidth="2.5" />
        </svg>
        
        {/* Categories Text */}
        <Label a={325} r={94} text={
          <div className="flex items-center gap-1 font-bold text-sm tracking-wide text-white">
            DCV
            <div className="flex flex-col mt-[2px]">
              <div className="w-3 border-t-2 border-white"></div>
              <div className="w-3 border-t-[1.5px] border-white border-dashed mt-[2px]"></div>
            </div>
          </div>
        } />
        <Label a={35} r={94} text={
          <div className="flex items-center gap-0.5 font-bold text-sm tracking-wide text-white">
            ACV
            <div className="text-lg leading-none -mt-1 font-serif">~</div>
          </div>
        } />
        <Label a={110} r={94} text={
          <div className="flex items-center gap-1 font-bold text-sm tracking-wide text-white">
            DCA
            <div className="flex flex-col mt-[2px]">
              <div className="w-3 border-t-2 border-white"></div>
              <div className="w-3 border-t-[1.5px] border-white border-dashed mt-[2px]"></div>
            </div>
          </div>
        } />
        <Label a={245} r={94} text="Ω" className="text-[#4ade80] text-2xl font-black" />


        {/* Dots */}
        <svg viewBox="0 0 200 200" className="w-full h-full absolute inset-0 z-0 pointer-events-none">
          {[25, 48, 75, 95, 112, 130, 150, 170, 190, 205, 220, 238, 255, 272, 288, 302, 316, 330, 344].map(angle => {
            const rad = (angle - 90) * Math.PI / 180;
            const x = 100 + 46 * Math.cos(rad);
            const y = 100 + 46 * Math.sin(rad);
            return <circle key={angle} cx={x} cy={y} r="1.5" fill="#ffffff" opacity="0.9" />;
          })}
        </svg>

        {/* Labels - OFF */}
        <Label a={0} r={68} text={<div className="border border-red-500 rounded-sm px-1 text-[9px] font-bold text-white relative z-10 bg-[#1a1c1d]">OFF</div>} />

        {/* ACV Labels */}
        <Label a={25} r={58} text="750" className="text-[#ffffff] text-[9px]" />
        <Label a={48} r={58} text="200" className="text-[#ffffff] text-[9px]" />

        {/* DCA Labels */}
        <Label a={75} r={58} text="200μ" className="text-[#ffffff] text-[9px]" />
        <Label a={95} r={58} text="2000μ" className="text-[#ffffff] text-[9px]" />
        <Label a={112} r={58} text="20m" className="text-[#ffffff] text-[9px]" />
        <Label a={130} r={58} text="200m" className="text-[#ffffff] text-[9px]" />
        <Label a={150} r={58} text="10A" className="text-[#ffffff] text-[9px]" />

        {/* hFE / Diode */}
        <Label a={170} r={58} text="hFE" className="text-[#ffffff] text-[9px]" />
        <Label a={190} r={58} text={<span className="text-sm font-bold flex items-center gap-0.5"><span>►|</span><span className="text-[9px]">•)))</span></span>} className="text-[#ffffff]" />

        {/* OHM Labels */}
        <Label a={205} r={58} text="200" className="text-[#4ade80] text-[9px]" />
        <Label a={220} r={58} text="2000" className="text-[#4ade80] text-[9px]" />
        <Label a={238} r={58} text="20k" className="text-[#4ade80] text-[9px]" />
        <Label a={255} r={58} text="200k" className="text-[#4ade80] text-[9px]" />
        <Label a={272} r={58} text="2000k" className="text-[#4ade80] text-[9px]" />

        {/* DCV Labels */}
        <Label a={288} r={58} text="200m" className="text-[#ffffff] text-[9px]" />
        <Label a={302} r={58} text="2000m" className="text-[#ffffff] text-[9px]" />
        <Label a={316} r={58} text="20" className="text-[#ffffff] text-[9px]" />
        <Label a={330} r={58} text="200" className="text-[#ffffff] text-[9px]" />
        <Label a={344} r={58} text="1000" className="text-[#ffffff] text-[9px]" />
        
        {/* Warning Texts near 10A */}
        <Label a={152} r={86} text={<div className="flex flex-col text-[7px] text-white opacity-80 leading-tight items-start"><span>10Amax</span><span>UNFUSED</span></div>} />

        {/* Animated Dial Knob */}
        <motion.div 
          animate={{ rotate: angle }}
          transition={{ type: "spring", stiffness: 60, damping: 15 }}
          className="absolute rounded-full bg-[#181a1b] border-4 border-[#0a0a0a] shadow-[0_8px_15px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.05)] flex items-center justify-center z-10"
          style={{ width: '42%', height: '42%', top: '29%', left: '29%' }}
        >
          {/* Knob handle (elongated) */}
          <div className="w-[30%] h-[90%] bg-[#2a2d2f] rounded-full relative shadow-[0_4px_10px_rgba(0,0,0,0.8)] flex flex-col items-center justify-start py-1.5 border-t border-b border-l border-r border-[#3a3d3f]">
             {/* Pointer triangle */}
             <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[6px] border-l-transparent border-r-transparent border-b-white opacity-100 drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]"></div>
          </div>
        </motion.div>
      </div>

      {/* Bottom section: Model name, Transistor Tester, Ports */}
      <div className="w-full flex justify-between items-end mt-4 px-2 z-0 relative flex-1">
        
        {/* Left side: Model & hFE */}
        <div className="flex flex-col gap-3 h-full justify-end pb-2">
          <div className="text-white font-bold text-2xl leading-tight tracking-wider">
             DT-830B
          </div>
          <div className="text-[#ffffff] font-semibold text-[9px] flex flex-col -mt-2 mb-1 opacity-90">
            <span className="flex items-center gap-1"><span className="border border-white p-[2px] rounded-[1px] leading-none">PCI</span> ELETROPARTS</span>
          </div>
          
          {/* Transistor test socket */}
          <div className="w-[3.5rem] h-[3.5rem] rounded-full border-2 border-[#0a0a0a] bg-[#1a1c1d] flex flex-col justify-center items-center gap-[2px] p-1 shadow-[inset_0_4px_6px_rgba(0,0,0,0.8)] relative">
             <div className="flex justify-between w-full px-2"><span className="text-[6px] text-white">E</span><span className="text-[6px] text-white">B</span><span className="text-[6px] text-white">C</span><span className="text-[6px] text-white">E</span></div>
             <div className="flex justify-between w-full px-2"><div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full shadow-inner"/><div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full shadow-inner"/><div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full shadow-inner"/><div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full shadow-inner"/></div>
             <div className="w-full flex justify-between px-1.5 my-[1px] relative">
               <span className="text-[7px] text-white font-bold opacity-80">NPN</span>
               <div className="w-[1px] h-full bg-[#333] absolute left-1/2 -translate-x-1/2" />
               <span className="text-[7px] text-white font-bold opacity-80">PNP</span>
             </div>
             <div className="flex justify-between w-full px-2"><div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full shadow-inner"/><div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full shadow-inner"/><div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full shadow-inner"/><div className="w-1.5 h-1.5 bg-[#0a0a0a] rounded-full shadow-inner"/></div>
             <div className="flex justify-between w-full px-2"><span className="text-[6px] text-white">E</span><span className="text-[6px] text-white">B</span><span className="text-[6px] text-white">C</span><span className="text-[6px] text-white">E</span></div>
          </div>
        </div>

        {/* Right side: Ports */}
        <div className="flex flex-col gap-3 relative pb-2 w-[140px]">
          
          {/* CE mark */}
          <div className="absolute bottom-6 -left-10 text-3xl font-serif text-white opacity-90 tracking-tighter">
            C<span className="ml-1">E</span>
          </div>

          {/* Connecting Lines & Warnings SVG */}
          <div className="absolute top-1 -left-4 bottom-1 w-16 pointer-events-none z-0">
            <svg viewBox="0 0 50 120" className="w-full h-full stroke-white fill-none stroke-[1.5px] opacity-80">
               {/* Vertical line */}
               <line x1="25" y1="20" x2="25" y2="105" />
               {/* 10A horizontal */}
               <line x1="25" y1="20" x2="45" y2="20" />
               {/* VΩmA horizontal */}
               <line x1="15" y1="62" x2="45" y2="62" />
               {/* COM horizontal */}
               <line x1="25" y1="105" x2="45" y2="105" />
               
               {/* Ground symbol */}
               <line x1="19" y1="105" x2="31" y2="105" />
               <line x1="22" y1="108" x2="28" y2="108" />
               <line x1="24" y1="111" x2="26" y2="111" />
            </svg>
            <svg viewBox="0 0 50 120" className="w-full h-full absolute inset-0 pointer-events-none fill-none stroke-red-500 stroke-[1.5px]">
               {/* Top red triangle */}
               <polygon points="17,46 25,31 33,46" />
               <text x="25" y="44" fill="#ef4444" stroke="none" fontSize="11" textAnchor="middle" fontWeight="bold">!</text>

               {/* Bottom red triangle */}
               <polygon points="17,88 25,73 33,88" />
               <text x="25" y="86" fill="#ef4444" stroke="none" fontSize="11" textAnchor="middle" fontWeight="bold">!</text>
            </svg>
            {/* Top Text */}
            <div className="absolute -top-3 left-0 w-full text-center flex flex-col text-[7px] text-white leading-[1.1] items-center">
              <span>10Amax</span>
              <span>unfused</span>
            </div>
            {/* Bottom Text */}
            <div className="absolute bottom-[2px] left-0 w-full text-center flex flex-col text-[7px] text-white leading-tight items-center">
              <span>500Vmax</span>
            </div>
          </div>

          {/* 10A Port */}
          <div className="flex justify-end items-center gap-2 relative z-10">
            <div className="flex flex-col items-end pr-1 text-right">
              <span className="text-[10px] font-bold text-white tracking-wide">10ADC</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1a1c1d] border-4 border-[#0a0a0a] flex items-center justify-center relative shadow-[inset_0_3px_5px_rgba(0,0,0,0.8)] flex-shrink-0">
               <div className="w-3.5 h-3.5 rounded-full bg-black shadow-inner" />
               {hasPower && is10A && <Probe color="red" />}
            </div>
          </div>

          {/* VΩmA Port */}
          <div className="flex justify-end items-center gap-2 relative z-10">
            <div className="flex flex-col items-end pr-1 text-right leading-[1.1]">
              <span className="text-[10px] font-bold text-white mb-0.5 tracking-wide">VΩmA</span>
              <span className="text-[7px] font-bold text-red-500">750VAC</span>
              <span className="text-[7px] font-bold text-red-500">1000VDC</span>
              <span className="text-[7px] font-bold text-red-500">200mAmax</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1a1c1d] border-4 border-[#0a0a0a] flex items-center justify-center relative shadow-[inset_0_3px_5px_rgba(0,0,0,0.8)] flex-shrink-0">
               <div className="w-3.5 h-3.5 rounded-full bg-black shadow-inner" />
               {hasPower && !is10A && <Probe color="red" />}
            </div>
          </div>

          {/* COM Port */}
          <div className="flex justify-end items-center gap-2 relative z-10">
            <div className="flex flex-col items-end pr-1 text-right">
              <span className="text-[10px] font-bold text-white tracking-wide">COM</span>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#1a1c1d] border-4 border-[#0a0a0a] flex items-center justify-center relative shadow-[inset_0_3px_5px_rgba(0,0,0,0.8)] flex-shrink-0">
               <div className="w-3.5 h-3.5 rounded-full bg-black shadow-inner" />
               {hasPower && <Probe color="black" />}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}


