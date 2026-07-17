import type { SVGProps } from "react";

/* Extracted from the Quechua SS25 lookbook. All use currentColor so they
   inherit text color. Sizing via className (width/height utilities). */

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 136 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M43.0657 19.5002H52.1921V16.6774H46.5388V14.3095H51.5457V11.6817H46.5388V9.31381H52.1921V6.50024H43.0657V19.5002ZM63.5181 13.901C62.1964 15.9252 60.9133 16.7702 59.2636 16.7702C57.1219 16.7702 55.8774 15.3217 55.8774 12.8052C55.8774 10.4188 57.0254 9.23023 58.7909 9.23023C59.9582 9.23023 60.923 9.73166 61.222 11.4031H64.6951C64.3188 8.21809 62.2061 6.24023 58.8295 6.24023C54.9127 6.24023 52.3368 8.90523 52.3368 12.9909C52.3368 17.1045 54.9127 19.7602 59.1479 19.7602C61.9167 19.7602 63.7979 18.6459 65.0424 17.1417H69.7793V19.5002H73.233V6.50023H68.3321L63.5181 13.901ZM69.7793 14.5324H66.721L69.7793 9.75023V14.5324ZM35.6565 6.50023H30.582V19.5002H35.6565C39.6795 19.5002 42.2746 16.9467 42.2746 13.0002C42.2746 9.05381 39.6795 6.50023 35.6565 6.50023ZM35.6083 16.6774H34.0551V9.31381H35.6083C37.615 9.31381 38.7437 10.6788 38.7437 13.0002C38.7437 15.3124 37.615 16.6774 35.6083 16.6774ZM113.096 6.24024C109.015 6.24024 106.275 8.90523 106.275 13.0002C106.275 17.0952 109.015 19.7602 113.096 19.7602C117.186 19.7602 119.917 17.0952 119.917 13.0002C119.917 8.90524 117.186 6.24024 113.096 6.24024ZM113.096 16.7702C111.089 16.7702 109.825 15.4795 109.825 13.0002C109.825 10.5209 111.089 9.23023 113.096 9.23023C115.112 9.23023 116.366 10.5209 116.366 13.0002C116.366 15.4795 115.112 16.7702 113.096 16.7702ZM74.1013 9.31381H77.5068V19.5002H80.9798V9.31381H84.3853V6.50024H74.1013L74.1013 9.31381ZM128.782 6.50024V13.6595L124.306 6.50024H120.708V19.5002H124.065V12.0438L128.725 19.5002H132.14V6.50023L128.782 6.50024ZM101.355 6.50024H97.882V19.5002H106.594V16.6867H101.355V6.50024ZM93.4056 11.4588H88.7267V6.50024H85.2536V19.5002H88.7267V14.2631H93.4056V19.5002H96.8787V6.50023H93.4056V11.4588Z"
        fill="currentColor"
      />
      <path
        d="M20.7823 3.71436C13.2406 3.71436 3.85944 11.2249 3.85944 17.4496C3.85944 20.6644 6.42497 22.2858 9.81341 22.2858C12.3015 22.2858 15.3124 21.4099 18.2167 19.7232V7.30191C17.4422 8.57852 13.8021 13.7222 10.8783 16.4618C9.38744 17.8596 8.20632 18.4653 7.1898 18.4653C6.0474 18.4653 5.50526 17.7198 5.50526 16.6109C5.50526 11.579 14.3055 5.03756 20.1336 5.03756C22.5346 5.03756 24.0836 6.06258 24.0836 8.0567C24.0836 9.88309 22.796 12.1754 20.5983 14.2907V18.1391C24.4321 15.2225 26.7265 11.5045 26.7265 8.50397C26.7265 5.34506 24.1707 3.71436 20.7823 3.71436Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.91579 6.27723L0.850021 10.9877C0.696847 11.0898 0.489887 11.0484 0.387767 10.8953C0.351267 10.8405 0.331787 10.7762 0.331787 10.7104L0.331787 1.28939C0.331787 1.10529 0.481027 0.956055 0.66512 0.956055C0.730927 0.956055 0.795267 0.975535 0.850021 1.01203L7.91579 5.7225C8.06892 5.82463 8.11035 6.03163 8.00822 6.18476C7.98341 6.22194 7.95297 6.25239 7.91579 6.27723Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0 0.166504H1.66667V11.8332H0V0.166504ZM8.33333 0.166504H10V11.8332H8.33333V0.166504Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.4763 5.51914L6.00631 1.15151L7.18481 0L13.6666 6.33338L7.18481 12.6667L6.00631 11.5152L10.4763 7.14763H0.333313V5.51914H10.4763Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.17244 7.0007L0.222656 2.05093L1.63688 0.636719L8.00084 7.0007L1.63688 13.3646L0.222656 11.9504L5.17244 7.0007Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 6V0H8V6H14V8H8V14H6V8H0V6H6Z" fill="currentColor" />
    </svg>
  );
}

/* Hand-drawn arrows used next to the Casey-script labels */
export function HandArrowLong(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 37" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M44.984 21.5948C33.7423 23.8404 24.0218 26.1233 13.3078 19.9695C5.08952 15.2491 5.20033 16.3697 0.931802 8.34035"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M36.471 35.5442C38.9826 31.2211 42.1312 26.8694 44.21 22.299C44.3699 21.9474 44.9061 21.2702 44.7791 20.8708C43.874 18.0238 36.9287 20.0719 34.8823 18.707"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HandArrowSmall(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 34" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.08366 26.7344C13.3675 24.315 18.937 22.4668 21.6222 14.2363C23.682 7.92297 24.0752 8.76307 22.9234 1.49966"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M14.8363 30.5117C11.174 28.6058 11.401 29.1536 7.93134 26.884C7.66444 26.7094 6.99112 26.474 6.9032 26.1392C6.27654 23.7534 8.41347 20.9168 9.23781 19.0604"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DragHandleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g fill="currentColor">
        <circle cx="2.5" cy="3" r="1.4" />
        <circle cx="7.5" cy="3" r="1.4" />
        <circle cx="2.5" cy="8" r="1.4" />
        <circle cx="7.5" cy="8" r="1.4" />
        <circle cx="2.5" cy="13" r="1.4" />
        <circle cx="7.5" cy="13" r="1.4" />
      </g>
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12.9024 18.5V11.5344H15.2347L15.5838 8.8265H12.9024V7.09765C12.9024 6.31364 13.12 5.77934 14.2443 5.77934L15.6783 5.77867V3.35676C15.4302 3.32382 14.5791 3.25006 13.5888 3.25006C11.5213 3.25006 10.106 4.51198 10.106 6.82952V8.8265H7.7677V11.5344H10.106V18.5H1.5C0.94772 18.5 0.5 18.0523 0.5 17.5V1.5C0.5 0.94772 0.94772 0.5 1.5 0.5H17.5C18.0523 0.5 18.5 0.94772 18.5 1.5V17.5C18.5 18.0523 18.0523 18.5 17.5 18.5H12.9024Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TiktokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M13.5 6.74537V14C13.5 17.5899 10.5899 20.5 7 20.5C3.41015 20.5 0.5 17.5899 0.5 14C0.5 10.4101 3.41015 7.5 7 7.5C7.5163 7.5 8.0185 7.56019 8.5 7.67393V10.8368C8.0454 10.6208 7.5368 10.5 7 10.5C5.067 10.5 3.5 12.067 3.5 14C3.5 15.933 5.067 17.5 7 17.5C8.933 17.5 10.5 15.933 10.5 14V0.5H13.5C13.5 3.26142 15.7386 5.5 18.5 5.5V8.5C16.6115 8.5 14.8693 7.85332 13.5 6.74537Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YoutubeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="1.5" y="5" width="21" height="14" rx="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 8.8L15 12L10 15.2V8.8Z" fill="currentColor" />
    </svg>
  );
}
