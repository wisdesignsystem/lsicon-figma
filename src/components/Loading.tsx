import React from "react";
import * as RDXDialog from "@radix-ui/react-dialog";

import "./Loading.css";

function Loading({ loading }: { loading: boolean }) {
  return (
    <RDXDialog.Root open={loading}>
      <RDXDialog.Portal>
        <RDXDialog.Overlay className="loading__overlay" />
        <RDXDialog.Content>
          <RDXDialog.Title className="loading__title">Loading</RDXDialog.Title>
          <RDXDialog.Description className="loading__title">Publishing</RDXDialog.Description>
          <div className="loading__content">
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="icon">
                <g id="Group 54">
                  <path
                    id="rect-line"
                    d="M35.9999 25.3333H17.3333V30.6666H35.9999V25.3333Z"
                    fill="url(#paint0_linear_32_193)"
                  />
                  <path
                    id="rect"
                    d="M10.2221 22.6667H3.11103C2.12919 22.6667 1.33325 23.4626 1.33325 24.4444V31.5555C1.33325 32.5374 2.12919 33.3333 3.11103 33.3333H10.2221C11.204 33.3333 11.9999 32.5374 11.9999 31.5555V24.4444C11.9999 23.4626 11.204 22.6667 10.2221 22.6667Z"
                    fill="#171717"
                  />
                  <path
                    id="triangle-line"
                    d="M1.33321 9.33331H19.9999V14.6666H1.33321V9.33331Z"
                    fill="url(#paint1_linear_32_193)"
                  />
                  <path
                    id="triangle"
                    d="M35.1109 17.3333H26.2223C26.0707 17.3333 25.9217 17.2946 25.7894 17.2209C25.657 17.1471 25.5457 17.0407 25.466 16.9118C25.3864 16.7829 25.341 16.6358 25.3342 16.4845C25.3273 16.3331 25.3593 16.1825 25.4271 16.047L29.8714 7.11848C29.9535 6.98076 30.0699 6.86671 30.2093 6.7875C30.3486 6.7083 30.5062 6.66666 30.6665 6.66666C30.8268 6.66666 30.9844 6.7083 31.1238 6.7875C31.2631 6.86671 31.3795 6.98076 31.4616 7.11848L35.9059 16.0471C35.9736 16.1826 36.0056 16.3332 35.9988 16.4845C35.9919 16.6359 35.9465 16.7829 35.8669 16.9118C35.7872 17.0407 35.676 17.147 35.5437 17.2208C35.4114 17.2946 35.2624 17.3333 35.1109 17.3333Z"
                    fill="#171717"
                  />
                </g>
              </g>
              <defs>
                <linearGradient
                  id="paint0_linear_32_193"
                  x1="17.3333"
                  y1="28"
                  x2="35.9999"
                  y2="28"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FE5124" />
                  <stop offset="1" stopColor="#FE5124" stopOpacity="0" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_32_193"
                  x1="19.9999"
                  y1="12"
                  x2="1.33321"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FE5124" />
                  <stop offset="1" stopColor="#FE5124" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </RDXDialog.Content>
      </RDXDialog.Portal>
    </RDXDialog.Root>
  );
}

export default Loading;
