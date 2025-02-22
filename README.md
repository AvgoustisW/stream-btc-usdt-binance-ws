# Hi, thank you for reviewing, it was a fun challenge.

## How to run:

You can find it deployed on vercel here: [https://stream-them-all.vercel.app/](https://stream-them-all.vercel.app/)

If you decide to run it locally, you will first need to create an `.env` file in the root of the project with the following content:

```
VITE_CRYPTOCOMPARE_API_KEY=your_api_key
```

Then:

`npm install`

`npm run dev`

node version `22.2.0`

## Structure and Technologies:

Vite, React, React Router, Tailwind, Typescript, Zustand, React Window (for virtualization).

To control the stream I have created a zustand store that handles all of it -> `webSocketStore.ts`.

To hopefully help out with your reviewing, I have included some `console.log` + `console.error` code for the websocket connections,disconnections, reconnections, errors etc.

I have well accounted for server errors, heartbeats, keeping the stream in sync with CCSEQ and so on.

Could the code be compartmentalized a bit more? Sure it could. I have componentized the code as much as as I could, and in places where actual value materializes. When it comes to the `webSocketStore.ts` code and for our case, I find it simpler to keep it in one place and not have to jump around files to understand what is going on.

## Process

I went through the documentation of Order Book L2 and made a very close representation of their models/rules in `webSocketStore.types.ts`.

When it comes to memory leak, it was my biggest concern. I have tested it in a few ways and it's not present so far. I have consitently simulated a memory leak by inspecting dev tools and looking at the websocket incoming data. The browser stores it for debugging and as it is logical, the memory allocated grows and grows. By keeping the dev tools closed I haven't found any memory leaks thus far.

## Shadow Banned:

I got shadow banned from CryptoCompare on my first attempt to stream the data, getting `429 Too Many Requests` error that just wouldn't go away. Making a second account from the same IP did not solve the problem, they did their due dilligence. Making a third account from a different IP did provide a working api key.

## Why is there no throttling? Do you not want the user to see what's going on in the monitor screen?

I did implement throttling at first. The performance & UI/UX was much smoother and more performant on the Monitor page. The problem was that the data coming in the screen was just not up to date to the real data from the WS connection. Given this is a terminal app that displays **financial** data, and that I did not have any business requirements I preferred to just remove all throttling logic and perhaps discuss it with you in the interview. I am quite curious myself of what is the best approach.

## What can be improved? What is missing?

- Accessibility. There are no aria-labels or screen reader solutions. Not that it would make sense to have any.
- Mobile support, I have styled the app for desktop only, best viewed in 1080p+ screens.
- [Tailwind Merge](https://github.com/dcastil/tailwind-merge) for better readability and maintanability.
- Git history. It's okay, but I am using 1 branch for the whole project.
