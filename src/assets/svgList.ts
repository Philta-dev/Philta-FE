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
  tabbar: {
    typing: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_170_4788" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
    <rect width="24" height="24" fill="#3C3C43" fill-opacity="0.6"/>
    </mask>
    <g mask="url(#mask0_170_4788)">
    <path d="M15.7885 20.5H5.30775C4.80258 20.5 4.375 20.325 4.025 19.975C3.675 19.625 3.5 19.1974 3.5 18.6922V5.30772C3.5 4.80255 3.675 4.37497 4.025 4.02497C4.375 3.67497 4.80258 3.49997 5.30775 3.49997H18.6923C19.1974 3.49997 19.625 3.67497 19.975 4.02497C20.325 4.37497 20.5 4.80255 20.5 5.30772V15.7885L15.7885 20.5ZM15 19V17C15 16.45 15.1958 15.9791 15.5875 15.5875C15.9792 15.1958 16.45 15 17 15H19V5.30772C19 5.23072 18.9679 5.16022 18.9038 5.09622C18.8398 5.03205 18.7692 4.99997 18.6923 4.99997H5.30775C5.23075 4.99997 5.16025 5.03205 5.09625 5.09622C5.03208 5.16022 5 5.23072 5 5.30772V18.6922C5 18.7692 5.03208 18.8397 5.09625 18.9037C5.16025 18.9679 5.23075 19 5.30775 19H15Z" fill="#3C3C43" fill-opacity="0.6"/>
    </g>
    <path d="M9.47363 15.1579V8.21054H12.6104C13.9691 8.21054 14.8232 8.88458 14.8232 9.9534V9.96303C14.8232 10.7237 14.2238 11.3737 13.4296 11.4748V11.5037C14.4336 11.5759 15.1578 12.2596 15.1578 13.1695V13.1791C15.1578 14.3972 14.2038 15.1579 12.6654 15.1579H9.47363ZM12.2208 9.289H10.9821V11.1137H12.036C12.8852 11.1137 13.3397 10.7719 13.3397 10.1701V10.1604C13.3397 9.60675 12.9251 9.289 12.2208 9.289ZM12.2158 12.1007H10.9821V14.0746H12.2808C13.1449 14.0746 13.6194 13.7328 13.6194 13.0877V13.078C13.6194 12.4425 13.1399 12.1007 12.2158 12.1007Z" fill="#3C3C43" fill-opacity="0.6"/>
    </svg>
    
    `,
    typingPressed: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.4613 8.63369L11.2753 10.1837L13.2237 15.011C13.3025 15.2064 13.4646 15.3562 13.6655 15.4197L23.0819 18.3934C23.1517 18.4155 23.2233 18.4262 23.2943 18.4262C23.4786 18.4262 23.659 18.3539 23.7933 18.2195C23.9794 18.0333 24.0465 17.7592 23.9672 17.5081L20.9935 8.0917C20.93 7.8905 20.7799 7.72832 20.5841 7.64959L15.7724 5.71346L14.2099 3.88498C14.0821 3.73539 13.8976 3.64598 13.7011 3.63832C13.5054 3.63116 13.3136 3.70535 13.1745 3.84445L9.42078 7.59839C9.28168 7.73749 9.20699 7.9283 9.21465 8.12496C9.22241 8.32152 9.31182 8.50588 9.4613 8.63369ZM21.7525 15.1807L17.0105 10.4387C16.735 10.1632 16.2883 10.1631 16.0126 10.4387C15.7371 10.7142 15.7371 11.161 16.0126 11.4365L20.7545 16.1785L14.4079 14.1742L12.702 9.9479L15.5179 7.13199L19.7484 8.83428L21.7525 15.1807ZM13.6329 5.38193L14.3883 6.26593L11.8423 8.812L10.9583 8.05662L13.6329 5.38193Z" fill="black"/>
    </svg>`,
    indexing: `<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.55775 19.5C2.71325 19.5 1.9925 19.2015 1.3955 18.6045C0.7985 18.0075 0.5 17.2868 0.5 16.4423V3.75003C0.5 2.84753 0.816 2.0802 1.448 1.44803C2.08017 0.81603 2.8475 0.500031 3.75 0.500031H13.6923C14.1894 0.500031 14.615 0.67703 14.969 1.03103C15.323 1.38503 15.5 1.81061 15.5 2.30778V14.448C15.5 14.5667 15.4538 14.6743 15.3615 14.7708C15.2692 14.8671 15.1198 14.9595 14.9135 15.048C14.6225 15.1519 14.3878 15.3286 14.2095 15.5783C14.0313 15.8279 13.9423 16.1159 13.9423 16.4423C13.9423 16.7628 14.0297 17.0503 14.2048 17.3048C14.3798 17.5593 14.6128 17.7365 14.9038 17.8365C15.0923 17.9109 15.2387 18.0152 15.3432 18.1495C15.4477 18.2837 15.5 18.4274 15.5 18.5808V18.7345C15.5 18.9462 15.4281 19.1267 15.2843 19.276C15.1406 19.4254 14.9625 19.5 14.75 19.5H3.55775ZM4.94275 13.3848C5.15525 13.3848 5.33333 13.3129 5.477 13.169C5.6205 13.0254 5.69225 12.8473 5.69225 12.6348V2.75003C5.69225 2.53753 5.62033 2.35936 5.4765 2.21553C5.33267 2.07186 5.1545 2.00003 4.942 2.00003C4.72933 2.00003 4.55125 2.07186 4.40775 2.21553C4.26408 2.35936 4.19225 2.53753 4.19225 2.75003V12.6348C4.19225 12.8473 4.26417 13.0254 4.408 13.169C4.55183 13.3129 4.73008 13.3848 4.94275 13.3848ZM3.55775 18H12.902C12.757 17.773 12.6442 17.5317 12.5635 17.276C12.4827 17.0202 12.4423 16.7423 12.4423 16.4423C12.4423 16.1564 12.4801 15.8821 12.5557 15.6193C12.6314 15.3564 12.7468 15.1115 12.902 14.8845H3.55775C3.11158 14.8845 2.74042 15.036 2.44425 15.339C2.14808 15.6419 2 16.0096 2 16.4423C2 16.8884 2.14808 17.2596 2.44425 17.5558C2.74042 17.8519 3.11158 18 3.55775 18Z" fill="#3C3C43" fill-opacity="0.6"/>
    </svg>
    `,
    indexingPressed: `<svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.55775 19.5C2.71325 19.5 1.9925 19.2015 1.3955 18.6045C0.7985 18.0075 0.5 17.2868 0.5 16.4423V3.75003C0.5 2.84753 0.816 2.0802 1.448 1.44803C2.08017 0.81603 2.8475 0.500031 3.75 0.500031H13.6923C14.1894 0.500031 14.615 0.67703 14.969 1.03103C15.323 1.38503 15.5 1.81061 15.5 2.30778V14.448C15.5 14.5667 15.4538 14.6743 15.3615 14.7708C15.2692 14.8671 15.1198 14.9595 14.9135 15.048C14.6225 15.1519 14.3878 15.3286 14.2095 15.5783C14.0313 15.8279 13.9423 16.1159 13.9423 16.4423C13.9423 16.7628 14.0297 17.0503 14.2048 17.3048C14.3798 17.5593 14.6128 17.7365 14.9038 17.8365C15.0923 17.9109 15.2387 18.0152 15.3432 18.1495C15.4477 18.2837 15.5 18.4274 15.5 18.5808V18.7345C15.5 18.9462 15.4281 19.1267 15.2843 19.276C15.1406 19.4254 14.9625 19.5 14.75 19.5H3.55775ZM4.94275 13.3848C5.15525 13.3848 5.33333 13.3129 5.477 13.169C5.6205 13.0254 5.69225 12.8473 5.69225 12.6348V2.75003C5.69225 2.53753 5.62033 2.35936 5.4765 2.21553C5.33267 2.07186 5.1545 2.00003 4.942 2.00003C4.72933 2.00003 4.55125 2.07186 4.40775 2.21553C4.26408 2.35936 4.19225 2.53753 4.19225 2.75003V12.6348C4.19225 12.8473 4.26417 13.0254 4.408 13.169C4.55183 13.3129 4.73008 13.3848 4.94275 13.3848ZM3.55775 18H12.902C12.757 17.773 12.6442 17.5317 12.5635 17.276C12.4827 17.0202 12.4423 16.7423 12.4423 16.4423C12.4423 16.1564 12.4801 15.8821 12.5557 15.6193C12.6314 15.3564 12.7468 15.1115 12.902 14.8845H3.55775C3.11158 14.8845 2.74042 15.036 2.44425 15.339C2.14808 15.6419 2 16.0096 2 16.4423C2 16.8884 2.14808 17.2596 2.44425 17.5558C2.74042 17.8519 3.11158 18 3.55775 18Z" fill="black"/>
    </svg>
    `,
    favorite: `<svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 14.4615L3.03075 16.1652C2.42825 16.4229 1.85583 16.3736 1.3135 16.0172C0.771167 15.6609 0.5 15.1596 0.5 14.5135V2.30772C0.5 1.80255 0.675 1.37497 1.025 1.02497C1.375 0.67497 1.80258 0.499969 2.30775 0.499969H11.6923C12.1974 0.499969 12.625 0.67497 12.975 1.02497C13.325 1.37497 13.5 1.80255 13.5 2.30772V14.5135C13.5 15.1596 13.2288 15.6609 12.6865 16.0172C12.1442 16.3736 11.5718 16.4229 10.9693 16.1652L7 14.4615ZM7 12.8L11.5673 14.7672C11.6699 14.8121 11.7677 14.8025 11.8605 14.7385C11.9535 14.6743 12 14.5877 12 14.4787V2.30772C12 2.23072 11.9679 2.16022 11.9038 2.09622C11.8398 2.03205 11.7692 1.99997 11.6923 1.99997H2.30775C2.23075 1.99997 2.16025 2.03205 2.09625 2.09622C2.03208 2.16022 2 2.23072 2 2.30772V14.4787C2 14.5877 2.0465 14.6743 2.1395 14.7385C2.23233 14.8025 2.33008 14.8121 2.43275 14.7672L7 12.8Z" fill="#3C3C43" fill-opacity="0.6"/>
    </svg>
    `,
    favoritePressed: `<svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 14.4615L3.03075 16.1652C2.42825 16.4229 1.85583 16.3736 1.3135 16.0172C0.771167 15.6609 0.5 15.1596 0.5 14.5135V2.30772C0.5 1.80255 0.675 1.37497 1.025 1.02497C1.375 0.67497 1.80258 0.499969 2.30775 0.499969H11.6923C12.1974 0.499969 12.625 0.67497 12.975 1.02497C13.325 1.37497 13.5 1.80255 13.5 2.30772V14.5135C13.5 15.1596 13.2288 15.6609 12.6865 16.0172C12.1442 16.3736 11.5718 16.4229 10.9693 16.1652L7 14.4615ZM7 12.8L11.5673 14.7672C11.6699 14.8121 11.7677 14.8025 11.8605 14.7385C11.9535 14.6743 12 14.5877 12 14.4787V2.30772C12 2.23072 11.9679 2.16022 11.9038 2.09622C11.8398 2.03205 11.7692 1.99997 11.6923 1.99997H2.30775C2.23075 1.99997 2.16025 2.03205 2.09625 2.09622C2.03208 2.16022 2 2.23072 2 2.30772V14.4787C2 14.5877 2.0465 14.6743 2.1395 14.7385C2.23233 14.8025 2.33008 14.8121 2.43275 14.7672L7 12.8Z" fill="black"/>
    </svg>
    `,
  },
  typing: {
    menu: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_170_4471" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
    <rect width="24" height="24" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_170_4471)">
    <path d="M4 18C3.71667 18 3.47917 17.9042 3.2875 17.7125C3.09583 17.5208 3 17.2833 3 17C3 16.7167 3.09583 16.4792 3.2875 16.2875C3.47917 16.0958 3.71667 16 4 16H20C20.2833 16 20.5208 16.0958 20.7125 16.2875C20.9042 16.4792 21 16.7167 21 17C21 17.2833 20.9042 17.5208 20.7125 17.7125C20.5208 17.9042 20.2833 18 20 18H4ZM4 13C3.71667 13 3.47917 12.9042 3.2875 12.7125C3.09583 12.5208 3 12.2833 3 12C3 11.7167 3.09583 11.4792 3.2875 11.2875C3.47917 11.0958 3.71667 11 4 11H20C20.2833 11 20.5208 11.0958 20.7125 11.2875C20.9042 11.4792 21 11.7167 21 12C21 12.2833 20.9042 12.5208 20.7125 12.7125C20.5208 12.9042 20.2833 13 20 13H4ZM4 8C3.71667 8 3.47917 7.90417 3.2875 7.7125C3.09583 7.52083 3 7.28333 3 7C3 6.71667 3.09583 6.47917 3.2875 6.2875C3.47917 6.09583 3.71667 6 4 6H20C20.2833 6 20.5208 6.09583 20.7125 6.2875C20.9042 6.47917 21 6.71667 21 7C21 7.28333 20.9042 7.52083 20.7125 7.7125C20.5208 7.90417 20.2833 8 20 8H4Z" fill="#1C1B1F"/>
    </g>
    </svg>
    `,
    menux: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_167_2038" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
    <rect width="24" height="24" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_167_2038)">
    <path d="M6.4 19L5 17.6L10.6 12L5 6.4L6.4 5L12 10.6L17.6 5L19 6.4L13.4 12L19 17.6L17.6 19L12 13.4L6.4 19Z" fill="white"/>
    </g>
    </svg>
    `,
    bookmarkBlue: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_185_3543" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_185_3543)">
    <path d="M16 23.282L10.2564 25.752C9.55549 26.0478 8.89315 25.9888 8.26937 25.575C7.64537 25.1615 7.33337 24.5826 7.33337 23.8384V6.66669C7.33337 6.09803 7.53737 5.60825 7.94537 5.19736C8.35337 4.78669 8.8446 4.58136 9.41904 4.58136H22.581C23.1555 4.58136 23.6467 4.78669 24.0547 5.19736C24.4627 5.60825 24.6667 6.09803 24.6667 6.66669V23.8384C24.6667 24.5826 24.3547 25.1615 23.7307 25.575C23.1069 25.9888 22.4446 26.0478 21.7437 25.752L16 23.282Z" fill="#5856D6"/>
    </g>
    </svg>
    `,
    bookmarkBlack: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_170_4418" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_170_4418)">
    <path d="M16 23.282L10.2564 25.752C9.55549 26.0478 8.89315 25.9888 8.26937 25.575C7.64537 25.1615 7.33337 24.5826 7.33337 23.8384V6.66669C7.33337 6.09803 7.53737 5.60825 7.94537 5.19736C8.35337 4.78669 8.8446 4.58136 9.41904 4.58136H22.581C23.1555 4.58136 23.6467 4.78669 24.0547 5.19736C24.4627 5.60825 24.6667 6.09803 24.6667 6.66669V23.8384C24.6667 24.5826 24.3547 25.1615 23.7307 25.575C23.1069 25.9888 22.4446 26.0478 21.7437 25.752L16 23.282Z" fill="#1C1B1F"/>
    </g>
    </svg>
    `,
    bookmarkAdd: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_185_3575" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_185_3575)">
    <path d="M16 24L9.77763 26.6666C9.03696 26.9851 8.33329 26.9258 7.66663 26.4886C6.99996 26.0515 6.66663 25.4331 6.66663 24.6333V6.11098C6.66663 5.51098 6.88696 4.99064 7.32763 4.54998C7.76851 4.10931 8.28896 3.88898 8.88896 3.88898H16.889C17.2036 3.88898 17.4675 3.99576 17.6806 4.20931C17.8935 4.42309 18 4.68798 18 5.00398C18 5.31976 17.8935 5.5832 17.6806 5.79431C17.4675 6.00542 17.2036 6.11098 16.889 6.11098H8.88896V24.6223L16 21.6L23.111 24.6223V15.2223C23.111 14.9074 23.2178 14.6435 23.4316 14.4306C23.6454 14.2175 23.9102 14.111 24.226 14.111C24.542 14.111 24.8055 14.2175 25.0166 14.4306C25.2277 14.6435 25.3333 14.9074 25.3333 15.2223V24.6333C25.3333 25.4331 25 26.0515 24.3333 26.4886C23.6666 26.9258 22.963 26.9851 22.2223 26.6666L16 24ZM23.111 8.99998H21.3333C21.0184 8.99998 20.7545 8.89309 20.5416 8.67931C20.3287 8.46576 20.2223 8.20098 20.2223 7.88498C20.2223 7.56898 20.3287 7.30542 20.5416 7.09431C20.7545 6.8832 21.0184 6.77764 21.3333 6.77764H23.111V4.99998C23.111 4.68509 23.2178 4.4212 23.4316 4.20831C23.6454 3.99542 23.9102 3.88898 24.226 3.88898C24.542 3.88898 24.8055 3.99542 25.0166 4.20831C25.2277 4.4212 25.3333 4.68509 25.3333 4.99998V6.77764H27.111C27.4258 6.77764 27.6897 6.88453 27.9026 7.09831C28.1157 7.31209 28.2223 7.57687 28.2223 7.89265C28.2223 8.20865 28.1157 8.4722 27.9026 8.68331C27.6897 8.89442 27.4258 8.99998 27.111 8.99998H25.3333V10.7776C25.3333 11.0925 25.2264 11.3564 25.0126 11.5693C24.7991 11.7824 24.5343 11.889 24.2183 11.889C23.9023 11.889 23.6387 11.7824 23.4276 11.5693C23.2165 11.3564 23.111 11.0925 23.111 10.7776V8.99998Z" fill="#1C1B1F"/>
    </g>
    </svg>
    `,
    clipboard: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_170_4334" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" transform="matrix(-1 0 0 1 32 0)" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_170_4334)">
    <path d="M19.923 23.3333C20.5966 23.3333 21.1667 23.1 21.6333 22.6333C22.1 22.1666 22.3333 21.5965 22.3333 20.923V5.74365C22.3333 5.07009 22.1 4.49998 21.6333 4.03331C21.1667 3.56665 20.5966 3.33331 19.923 3.33331H8.74367C8.07011 3.33331 7.5 3.56665 7.03333 4.03331C6.56667 4.49998 6.33333 5.07009 6.33333 5.74365V20.923C6.33333 21.5965 6.56667 22.1666 7.03333 22.6333C7.5 23.1 8.07011 23.3333 8.74367 23.3333H19.923ZM19.923 21.3333H8.74367C8.641 21.3333 8.547 21.2905 8.46167 21.205C8.37611 21.1196 8.33333 21.0256 8.33333 20.923V5.74365C8.33333 5.64098 8.37611 5.54698 8.46167 5.46165C8.547 5.37609 8.641 5.33331 8.74367 5.33331H19.923C20.0257 5.33331 20.1197 5.37609 20.205 5.46165C20.2906 5.54698 20.3333 5.64098 20.3333 5.74365V20.923C20.3333 21.0256 20.2906 21.1196 20.205 21.205C20.1197 21.2905 20.0257 21.3333 19.923 21.3333ZM24.5897 28C25.2632 28 25.8333 27.7666 26.3 27.3C26.7667 26.8333 27 26.2632 27 25.5896V9.41031C27 9.12653 26.9042 8.88887 26.7127 8.69731C26.5213 8.50598 26.2838 8.41031 26 8.41031C25.7162 8.41031 25.4786 8.50598 25.287 8.69731C25.0957 8.88887 25 9.12653 25 9.41031V25.5896C25 25.6923 24.9572 25.7863 24.8717 25.8716C24.7863 25.9572 24.6923 26 24.5897 26H12.4103C12.1266 26 11.8889 26.0956 11.6973 26.287C11.506 26.4785 11.4103 26.7162 11.4103 27C11.4103 27.2838 11.506 27.5213 11.6973 27.7126C11.8889 27.9042 12.1266 28 12.4103 28H24.5897Z" fill="#1C1B1F"/>
    </g>
    </svg>
    `,
    clipboardPressed: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_170_4334" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" transform="matrix(-1 0 0 1 32 0)" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_170_4334)">
    <path d="M19.923 23.3333C20.5966 23.3333 21.1667 23.1 21.6333 22.6333C22.1 22.1666 22.3333 21.5965 22.3333 20.923V5.74365C22.3333 5.07009 22.1 4.49998 21.6333 4.03331C21.1667 3.56665 20.5966 3.33331 19.923 3.33331H8.74367C8.07011 3.33331 7.5 3.56665 7.03333 4.03331C6.56667 4.49998 6.33333 5.07009 6.33333 5.74365V20.923C6.33333 21.5965 6.56667 22.1666 7.03333 22.6333C7.5 23.1 8.07011 23.3333 8.74367 23.3333H19.923ZM19.923 21.3333H8.74367C8.641 21.3333 8.547 21.2905 8.46167 21.205C8.37611 21.1196 8.33333 21.0256 8.33333 20.923V5.74365C8.33333 5.64098 8.37611 5.54698 8.46167 5.46165C8.547 5.37609 8.641 5.33331 8.74367 5.33331H19.923C20.0257 5.33331 20.1197 5.37609 20.205 5.46165C20.2906 5.54698 20.3333 5.64098 20.3333 5.74365V20.923C20.3333 21.0256 20.2906 21.1196 20.205 21.205C20.1197 21.2905 20.0257 21.3333 19.923 21.3333ZM24.5897 28C25.2632 28 25.8333 27.7666 26.3 27.3C26.7667 26.8333 27 26.2632 27 25.5896V9.41031C27 9.12653 26.9042 8.88887 26.7127 8.69731C26.5213 8.50598 26.2838 8.41031 26 8.41031C25.7162 8.41031 25.4786 8.50598 25.287 8.69731C25.0957 8.88887 25 9.12653 25 9.41031V25.5896C25 25.6923 24.9572 25.7863 24.8717 25.8716C24.7863 25.9572 24.6923 26 24.5897 26H12.4103C12.1266 26 11.8889 26.0956 11.6973 26.287C11.506 26.4785 11.4103 26.7162 11.4103 27C11.4103 27.2838 11.506 27.5213 11.6973 27.7126C11.8889 27.9042 12.1266 28 12.4103 28H24.5897Z" fill="#1C1B1F"/>
    </g>
    </svg>
    `,
    keyboardDown: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_170_4430" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_170_4430)">
    <path d="M15.5717 29.4694L12.313 26.2104C12.1164 26.0137 12.0672 25.7927 12.1654 25.5474C12.2638 25.302 12.4515 25.1794 12.7284 25.1794H19.2717C19.5486 25.1794 19.7363 25.302 19.8347 25.5474C19.9329 25.7927 19.8837 26.0137 19.687 26.2104L16.4284 29.4694C16.3035 29.594 16.1607 29.6564 16 29.6564C15.8394 29.6564 15.6966 29.594 15.5717 29.4694ZM5.74371 22C5.07015 22 4.50004 21.7667 4.03337 21.3C3.56671 20.8334 3.33337 20.2632 3.33337 19.5897V7.07702C3.33337 6.40346 3.56671 5.83335 4.03337 5.36669C4.50004 4.90002 5.07015 4.66669 5.74371 4.66669H26.2564C26.9299 4.66669 27.5 4.90002 27.9667 5.36669C28.4334 5.83335 28.6667 6.40346 28.6667 7.07702V19.5897C28.6667 20.2632 28.4334 20.8334 27.9667 21.3C27.5 21.7667 26.9299 22 26.2564 22H5.74371ZM5.74371 20H26.2564C26.359 20 26.453 19.9572 26.5384 19.8717C26.6239 19.7864 26.6667 19.6924 26.6667 19.5897V7.07702C26.6667 6.97435 26.6239 6.88035 26.5384 6.79502C26.453 6.70946 26.359 6.66669 26.2564 6.66669H5.74371C5.64104 6.66669 5.54704 6.70946 5.46171 6.79502C5.37615 6.88035 5.33337 6.97435 5.33337 7.07702V19.5897C5.33337 19.6924 5.37615 19.7864 5.46171 19.8717C5.54704 19.9572 5.64104 20 5.74371 20ZM12 18.5127H20C20.3265 18.5127 20.6047 18.3999 20.8347 18.1744C21.0645 17.9488 21.1794 17.6685 21.1794 17.3334C21.1794 17.0069 21.0645 16.7287 20.8347 16.4987C20.6047 16.2689 20.3265 16.154 20 16.154H12C11.6736 16.154 11.3954 16.2668 11.1654 16.4924C10.9356 16.7179 10.8207 16.9982 10.8207 17.3334C10.8207 17.6598 10.9356 17.938 11.1654 18.168C11.3954 18.3978 11.6736 18.5127 12 18.5127ZM8.00004 10.5127C8.32649 10.5127 8.60471 10.3978 8.83471 10.168C9.06449 9.93802 9.17937 9.6598 9.17937 9.33335C9.17937 9.00691 9.06449 8.72869 8.83471 8.49869C8.60471 8.26891 8.32649 8.15402 8.00004 8.15402C7.6736 8.15402 7.39537 8.26891 7.16537 8.49869C6.9356 8.72869 6.82071 9.00691 6.82071 9.33335C6.82071 9.6598 6.9356 9.93802 7.16537 10.168C7.39537 10.3978 7.6736 10.5127 8.00004 10.5127ZM12 10.5127C12.3265 10.5127 12.6047 10.3978 12.8347 10.168C13.0645 9.93802 13.1794 9.6598 13.1794 9.33335C13.1794 9.00691 13.0645 8.72869 12.8347 8.49869C12.6047 8.26891 12.3265 8.15402 12 8.15402C11.6736 8.15402 11.3954 8.26891 11.1654 8.49869C10.9356 8.72869 10.8207 9.00691 10.8207 9.33335C10.8207 9.6598 10.9356 9.93802 11.1654 10.168C11.3954 10.3978 11.6736 10.5127 12 10.5127ZM16 10.5127C16.3265 10.5127 16.6047 10.3978 16.8347 10.168C17.0645 9.93802 17.1794 9.6598 17.1794 9.33335C17.1794 9.00691 17.0645 8.72869 16.8347 8.49869C16.6047 8.26891 16.3265 8.15402 16 8.15402C15.6736 8.15402 15.3954 8.26891 15.1654 8.49869C14.9356 8.72869 14.8207 9.00691 14.8207 9.33335C14.8207 9.6598 14.9356 9.93802 15.1654 10.168C15.3954 10.3978 15.6736 10.5127 16 10.5127ZM20 10.5127C20.3265 10.5127 20.6047 10.3978 20.8347 10.168C21.0645 9.93802 21.1794 9.6598 21.1794 9.33335C21.1794 9.00691 21.0645 8.72869 20.8347 8.49869C20.6047 8.26891 20.3265 8.15402 20 8.15402C19.6736 8.15402 19.3954 8.26891 19.1654 8.49869C18.9356 8.72869 18.8207 9.00691 18.8207 9.33335C18.8207 9.6598 18.9356 9.93802 19.1654 10.168C19.3954 10.3978 19.6736 10.5127 20 10.5127ZM24 10.5127C24.3265 10.5127 24.6047 10.3978 24.8347 10.168C25.0645 9.93802 25.1794 9.6598 25.1794 9.33335C25.1794 9.00691 25.0645 8.72869 24.8347 8.49869C24.6047 8.26891 24.3265 8.15402 24 8.15402C23.6736 8.15402 23.3954 8.26891 23.1654 8.49869C22.9356 8.72869 22.8207 9.00691 22.8207 9.33335C22.8207 9.6598 22.9356 9.93802 23.1654 10.168C23.3954 10.3978 23.6736 10.5127 24 10.5127ZM8.00004 14.5127C8.32649 14.5127 8.60471 14.3978 8.83471 14.168C9.06449 13.938 9.17937 13.6598 9.17937 13.3334C9.17937 13.0069 9.06449 12.7287 8.83471 12.4987C8.60471 12.2689 8.32649 12.154 8.00004 12.154C7.6736 12.154 7.39537 12.2689 7.16537 12.4987C6.9356 12.7287 6.82071 13.0069 6.82071 13.3334C6.82071 13.6598 6.9356 13.938 7.16537 14.168C7.39537 14.3978 7.6736 14.5127 8.00004 14.5127ZM12 14.5127C12.3265 14.5127 12.6047 14.3978 12.8347 14.168C13.0645 13.938 13.1794 13.6598 13.1794 13.3334C13.1794 13.0069 13.0645 12.7287 12.8347 12.4987C12.6047 12.2689 12.3265 12.154 12 12.154C11.6736 12.154 11.3954 12.2689 11.1654 12.4987C10.9356 12.7287 10.8207 13.0069 10.8207 13.3334C10.8207 13.6598 10.9356 13.938 11.1654 14.168C11.3954 14.3978 11.6736 14.5127 12 14.5127ZM16 14.5127C16.3265 14.5127 16.6047 14.3978 16.8347 14.168C17.0645 13.938 17.1794 13.6598 17.1794 13.3334C17.1794 13.0069 17.0645 12.7287 16.8347 12.4987C16.6047 12.2689 16.3265 12.154 16 12.154C15.6736 12.154 15.3954 12.2689 15.1654 12.4987C14.9356 12.7287 14.8207 13.0069 14.8207 13.3334C14.8207 13.6598 14.9356 13.938 15.1654 14.168C15.3954 14.3978 15.6736 14.5127 16 14.5127ZM20 14.5127C20.3265 14.5127 20.6047 14.3978 20.8347 14.168C21.0645 13.938 21.1794 13.6598 21.1794 13.3334C21.1794 13.0069 21.0645 12.7287 20.8347 12.4987C20.6047 12.2689 20.3265 12.154 20 12.154C19.6736 12.154 19.3954 12.2689 19.1654 12.4987C18.9356 12.7287 18.8207 13.0069 18.8207 13.3334C18.8207 13.6598 18.9356 13.938 19.1654 14.168C19.3954 14.3978 19.6736 14.5127 20 14.5127ZM24 14.5127C24.3265 14.5127 24.6047 14.3978 24.8347 14.168C25.0645 13.938 25.1794 13.6598 25.1794 13.3334C25.1794 13.0069 25.0645 12.7287 24.8347 12.4987C24.6047 12.2689 24.3265 12.154 24 12.154C23.6736 12.154 23.3954 12.2689 23.1654 12.4987C22.9356 12.7287 22.8207 13.0069 22.8207 13.3334C22.8207 13.6598 22.9356 13.938 23.1654 14.168C23.3954 14.3978 23.6736 14.5127 24 14.5127Z" fill="#1C1B1F"/>
    </g>
    </svg>
    `,
    keyboardDownPressed: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="mask0_170_4430" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="32" height="32">
    <rect width="32" height="32" fill="#D9D9D9"/>
    </mask>
    <g mask="url(#mask0_170_4430)">
    <path d="M15.5717 29.4694L12.313 26.2104C12.1164 26.0137 12.0672 25.7927 12.1654 25.5474C12.2638 25.302 12.4515 25.1794 12.7284 25.1794H19.2717C19.5486 25.1794 19.7363 25.302 19.8347 25.5474C19.9329 25.7927 19.8837 26.0137 19.687 26.2104L16.4284 29.4694C16.3035 29.594 16.1607 29.6564 16 29.6564C15.8394 29.6564 15.6966 29.594 15.5717 29.4694ZM5.74371 22C5.07015 22 4.50004 21.7667 4.03337 21.3C3.56671 20.8334 3.33337 20.2632 3.33337 19.5897V7.07702C3.33337 6.40346 3.56671 5.83335 4.03337 5.36669C4.50004 4.90002 5.07015 4.66669 5.74371 4.66669H26.2564C26.9299 4.66669 27.5 4.90002 27.9667 5.36669C28.4334 5.83335 28.6667 6.40346 28.6667 7.07702V19.5897C28.6667 20.2632 28.4334 20.8334 27.9667 21.3C27.5 21.7667 26.9299 22 26.2564 22H5.74371ZM5.74371 20H26.2564C26.359 20 26.453 19.9572 26.5384 19.8717C26.6239 19.7864 26.6667 19.6924 26.6667 19.5897V7.07702C26.6667 6.97435 26.6239 6.88035 26.5384 6.79502C26.453 6.70946 26.359 6.66669 26.2564 6.66669H5.74371C5.64104 6.66669 5.54704 6.70946 5.46171 6.79502C5.37615 6.88035 5.33337 6.97435 5.33337 7.07702V19.5897C5.33337 19.6924 5.37615 19.7864 5.46171 19.8717C5.54704 19.9572 5.64104 20 5.74371 20ZM12 18.5127H20C20.3265 18.5127 20.6047 18.3999 20.8347 18.1744C21.0645 17.9488 21.1794 17.6685 21.1794 17.3334C21.1794 17.0069 21.0645 16.7287 20.8347 16.4987C20.6047 16.2689 20.3265 16.154 20 16.154H12C11.6736 16.154 11.3954 16.2668 11.1654 16.4924C10.9356 16.7179 10.8207 16.9982 10.8207 17.3334C10.8207 17.6598 10.9356 17.938 11.1654 18.168C11.3954 18.3978 11.6736 18.5127 12 18.5127ZM8.00004 10.5127C8.32649 10.5127 8.60471 10.3978 8.83471 10.168C9.06449 9.93802 9.17937 9.6598 9.17937 9.33335C9.17937 9.00691 9.06449 8.72869 8.83471 8.49869C8.60471 8.26891 8.32649 8.15402 8.00004 8.15402C7.6736 8.15402 7.39537 8.26891 7.16537 8.49869C6.9356 8.72869 6.82071 9.00691 6.82071 9.33335C6.82071 9.6598 6.9356 9.93802 7.16537 10.168C7.39537 10.3978 7.6736 10.5127 8.00004 10.5127ZM12 10.5127C12.3265 10.5127 12.6047 10.3978 12.8347 10.168C13.0645 9.93802 13.1794 9.6598 13.1794 9.33335C13.1794 9.00691 13.0645 8.72869 12.8347 8.49869C12.6047 8.26891 12.3265 8.15402 12 8.15402C11.6736 8.15402 11.3954 8.26891 11.1654 8.49869C10.9356 8.72869 10.8207 9.00691 10.8207 9.33335C10.8207 9.6598 10.9356 9.93802 11.1654 10.168C11.3954 10.3978 11.6736 10.5127 12 10.5127ZM16 10.5127C16.3265 10.5127 16.6047 10.3978 16.8347 10.168C17.0645 9.93802 17.1794 9.6598 17.1794 9.33335C17.1794 9.00691 17.0645 8.72869 16.8347 8.49869C16.6047 8.26891 16.3265 8.15402 16 8.15402C15.6736 8.15402 15.3954 8.26891 15.1654 8.49869C14.9356 8.72869 14.8207 9.00691 14.8207 9.33335C14.8207 9.6598 14.9356 9.93802 15.1654 10.168C15.3954 10.3978 15.6736 10.5127 16 10.5127ZM20 10.5127C20.3265 10.5127 20.6047 10.3978 20.8347 10.168C21.0645 9.93802 21.1794 9.6598 21.1794 9.33335C21.1794 9.00691 21.0645 8.72869 20.8347 8.49869C20.6047 8.26891 20.3265 8.15402 20 8.15402C19.6736 8.15402 19.3954 8.26891 19.1654 8.49869C18.9356 8.72869 18.8207 9.00691 18.8207 9.33335C18.8207 9.6598 18.9356 9.93802 19.1654 10.168C19.3954 10.3978 19.6736 10.5127 20 10.5127ZM24 10.5127C24.3265 10.5127 24.6047 10.3978 24.8347 10.168C25.0645 9.93802 25.1794 9.6598 25.1794 9.33335C25.1794 9.00691 25.0645 8.72869 24.8347 8.49869C24.6047 8.26891 24.3265 8.15402 24 8.15402C23.6736 8.15402 23.3954 8.26891 23.1654 8.49869C22.9356 8.72869 22.8207 9.00691 22.8207 9.33335C22.8207 9.6598 22.9356 9.93802 23.1654 10.168C23.3954 10.3978 23.6736 10.5127 24 10.5127ZM8.00004 14.5127C8.32649 14.5127 8.60471 14.3978 8.83471 14.168C9.06449 13.938 9.17937 13.6598 9.17937 13.3334C9.17937 13.0069 9.06449 12.7287 8.83471 12.4987C8.60471 12.2689 8.32649 12.154 8.00004 12.154C7.6736 12.154 7.39537 12.2689 7.16537 12.4987C6.9356 12.7287 6.82071 13.0069 6.82071 13.3334C6.82071 13.6598 6.9356 13.938 7.16537 14.168C7.39537 14.3978 7.6736 14.5127 8.00004 14.5127ZM12 14.5127C12.3265 14.5127 12.6047 14.3978 12.8347 14.168C13.0645 13.938 13.1794 13.6598 13.1794 13.3334C13.1794 13.0069 13.0645 12.7287 12.8347 12.4987C12.6047 12.2689 12.3265 12.154 12 12.154C11.6736 12.154 11.3954 12.2689 11.1654 12.4987C10.9356 12.7287 10.8207 13.0069 10.8207 13.3334C10.8207 13.6598 10.9356 13.938 11.1654 14.168C11.3954 14.3978 11.6736 14.5127 12 14.5127ZM16 14.5127C16.3265 14.5127 16.6047 14.3978 16.8347 14.168C17.0645 13.938 17.1794 13.6598 17.1794 13.3334C17.1794 13.0069 17.0645 12.7287 16.8347 12.4987C16.6047 12.2689 16.3265 12.154 16 12.154C15.6736 12.154 15.3954 12.2689 15.1654 12.4987C14.9356 12.7287 14.8207 13.0069 14.8207 13.3334C14.8207 13.6598 14.9356 13.938 15.1654 14.168C15.3954 14.3978 15.6736 14.5127 16 14.5127ZM20 14.5127C20.3265 14.5127 20.6047 14.3978 20.8347 14.168C21.0645 13.938 21.1794 13.6598 21.1794 13.3334C21.1794 13.0069 21.0645 12.7287 20.8347 12.4987C20.6047 12.2689 20.3265 12.154 20 12.154C19.6736 12.154 19.3954 12.2689 19.1654 12.4987C18.9356 12.7287 18.8207 13.0069 18.8207 13.3334C18.8207 13.6598 18.9356 13.938 19.1654 14.168C19.3954 14.3978 19.6736 14.5127 20 14.5127ZM24 14.5127C24.3265 14.5127 24.6047 14.3978 24.8347 14.168C25.0645 13.938 25.1794 13.6598 25.1794 13.3334C25.1794 13.0069 25.0645 12.7287 24.8347 12.4987C24.6047 12.2689 24.3265 12.154 24 12.154C23.6736 12.154 23.3954 12.2689 23.1654 12.4987C22.9356 12.7287 22.8207 13.0069 22.8207 13.3334C22.8207 13.6598 22.9356 13.938 23.1654 14.168C23.3954 14.3978 23.6736 14.5127 24 14.5127Z" fill="#1C1B1F"/>
    </g>
    </svg>
    `,
  },
};
