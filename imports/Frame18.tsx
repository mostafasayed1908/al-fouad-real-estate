import svgPaths from "./svg-wvzp5ojbif";
import imgImage31 from "figma:asset/e311b537164e8cb14a8213cbb83752d10aaf62f9.png";

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[11px] items-start not-italic relative shrink-0 w-[557px]">
      <p className="css-4hzbpn font-['Inter:Bold',sans-serif] font-bold leading-[0] relative shrink-0 text-[60px] text-black w-[528px]">
        <span className="leading-[normal]">{`Find Your `}</span>
        <span className="leading-[normal] text-[#b50b0d]">Perfect</span>
        <span className="leading-[normal]">{` Investment`}</span>
      </p>
      <p className="css-4hzbpn font-['Inter:Regular',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#787878] text-[24px] w-[460px]">{`Premium properties in Egypt's most sought-after locations`}</p>
    </div>
  );
}

function Group1() {
  return (
    <div className="col-1 h-[462.607px] ml-[45px] mt-[6px] relative row-1 w-[409.042px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 409.042 462.607">
        <g id="Group 5">
          <circle cx="204.521" cy="253.217" fill="var(--fill-0, #CB2028)" id="Ellipse 5" r="204.521" />
          <path d={svgPaths.p37351c00} fill="var(--fill-0, white)" id="Intersect" />
          <path d={svgPaths.p1a842b00} fill="var(--fill-0, white)" id="Intersect_2" />
          <path d={svgPaths.p2a346d00} fill="var(--fill-0, white)" id="Intersect_3" />
          <path d={svgPaths.p3232f900} fill="var(--fill-0, white)" id="Intersect_4" />
          <path d={svgPaths.p1a6a7480} fill="var(--fill-0, #CB2028)" id="Rectangle 12" />
          <path d={svgPaths.p231e6980} fill="var(--fill-0, white)" id="Rectangle 10" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="col-1 grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] ml-0 mt-0 relative row-1">
      <div className="col-1 h-[578px] ml-0 mt-0 relative row-1 w-[842px]" data-name="image 3 1">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[129.24%] left-[-11.13%] max-w-none top-0 w-[155.15%]" src={imgImage31} />
        </div>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid items-[start] justify-items-[start] leading-[0] relative shrink-0">
      <Group1 />
      <Group />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="content-stretch flex items-center justify-end relative size-full">
      <Frame />
      <Group2 />
    </div>
  );
}