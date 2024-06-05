export const svgList = {
  socialLogin: {
    kakao: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="7" fill="#FEE500"/>
        <g clip-path="url(#clip0_137_1251)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M25 15.6C20.0292 15.6 16 18.713 16 22.5523C16 24.94 17.5584 27.045 19.9315 28.297L18.933 31.9445C18.8448 32.2668 19.2134 32.5237 19.4965 32.3369L23.8733 29.4482C24.2427 29.4838 24.6181 29.5046 25 29.5046C29.9705 29.5046 33.9999 26.3918 33.9999 22.5523C33.9999 18.713 29.9705 15.6 25 15.6Z" fill="black"/>
        </g>
        <defs>
        <clipPath id="clip0_137_1251">
        <rect width="17.9999" height="18" fill="white" transform="translate(16 15)"/>
        </clipPath>
        </defs>
        </svg>
        `,
    apple: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <rect width="48" height="48" fill="url(#pattern0_137_1257)"/>
        <defs>
        <pattern id="pattern0_137_1257" patternContentUnits="objectBoundingBox" width="1" height="1">
        <use xlink:href="#image0_137_1257" transform="scale(0.005)"/>
        </pattern>
        <image id="image0_137_1257" width="200" height="200" xlink:href="data:image/png;base64,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"/>
        </defs>
        </svg>
        `,
  },
  backBtn: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <mask id="mask0_185_3427" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
  <rect width="24" height="24" fill="#D9D9D9"/>
  </mask>
  <g mask="url(#mask0_185_3427)">
  <path d="M3.55 12L10.9 19.35C11.15 19.6 11.2708 19.8917 11.2625 20.225C11.2542 20.5583 11.125 20.85 10.875 21.1C10.625 21.35 10.3333 21.475 10 21.475C9.66666 21.475 9.375 21.35 9.125 21.1L1.425 13.425C1.225 13.225 1.075 13 0.974997 12.75C0.874997 12.5 0.824997 12.25 0.824997 12C0.824997 11.75 0.874997 11.5 0.974997 11.25C1.075 11 1.225 10.775 1.425 10.575L9.125 2.87499C9.375 2.62499 9.67083 2.50415 10.0125 2.51249C10.3542 2.52082 10.65 2.64999 10.9 2.89999C11.15 3.14999 11.275 3.44165 11.275 3.77499C11.275 4.10832 11.15 4.39999 10.9 4.64999L3.55 12Z" fill="#1C1B1F"/>
  </g>
  </svg>
  `,
};
