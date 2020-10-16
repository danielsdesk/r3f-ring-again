import React from "react"
import "styled-components/macro"

export default function Overlay() {
  return (
    <div
      css={`
        pointer-events: none;
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
      `}>
      <div
        css={`
          position: absolute;
          left: 50px;
          bottom: 50px;
          white-space: pre;
        `}>
        {`One Jove,\nOne Pluto,\nOne Sun is Serapis.`}
      </div>
      <div
        css={`
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        `}>
        <div
          css={`
            text-align: center;
          `}>
          <div
            css={`
              white-space: pre;
              margin-bottom: 2.5rem;
              font-size: 10em;
              font-weight: 800;
              line-height: 0.6em;
              letter-spacing: -6px;
            `}>
            {`Oration Upon`}
            <span
              css={`
                font-size: 2rem;
                letter-spacing: -2px;
                margin-left: 10px;
              `}>
              the
            </span>
            {`\nSovereign Sun`}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Socials() {
  return (
    <div
      css={`
        position: absolute;
        right: 50px;
        top: 50px;
      `}>
      <a href="https://twitter.com/pmndrs">Twitter</a>
      <a href="https://github.com/pmndrs">Github</a>
      <a href="https://pmnd.rs/discord">Discord</a>
    </div>
  )
}
