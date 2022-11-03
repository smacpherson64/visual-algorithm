import * as React from "react";
import { useMachine } from "@xstate/react";
import { createMachine, assign, State } from "xstate";
import { classNames } from "./utils";
import Code from "./Code";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function toFieldData(number: number, key: number | string) {
  return { number, key: `${key}`, markedAsZero: false };
}

function generateList() {
  return [
    getRandomInt(0, 99),
    getRandomInt(0, 2) ? getRandomInt(1, 99) : 0,
    getRandomInt(0, 3) ? getRandomInt(1, 99) : 0,
    getRandomInt(0, 1) ? getRandomInt(1, 99) : 0,
    getRandomInt(0, 5) ? getRandomInt(1, 99) : 0,
    getRandomInt(0, 1) ? getRandomInt(1, 99) : 0,
    getRandomInt(0, 3) ? getRandomInt(1, 99) : 0,
    getRandomInt(0, 1) ? getRandomInt(1, 99) : 0,
  ].map(toFieldData);
}

export const Screen = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <div {...props} className="relative bg-gray-50 min-h-screen w-full">
    <div className="relative pt-6 pb-16 sm:pb-24">
      <main className="mt-16 mx-auto max-w-3xl px-4 sm:mt-24">{children}</main>
    </div>
  </div>
);

export function CurrentArrow({ hide = false, position = 8 }) {
  return (
    <div
      className="transition py-4 absolute -top-12 flex justify-center text-blue-600"
      style={{
        width: "calc((1/8) *  100%)",
        opacity: hide ? 0 : 100,
        transform: hide ? "" : `translateX(calc(${position} * 100%))`,
      }}
    >
      <svg
        className="transform rotate-90"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.068.016l-3.717 3.698 5.263 5.286h-13.614v6h13.614l-5.295 5.317 3.718 3.699 11.963-12.016z" />
      </svg>
    </div>
  );
}

export function TargetArrow({ hide = false, position = 8 }) {
  return (
    <div
      className="transition py-4 absolute -bottom-12 flex justify-center text-gray-400"
      style={{
        width: "calc((1/8) *  100%)",
        opacity: hide ? 0 : 100,
        transform: hide ? "" : `translateX(calc(${position} * 100%))`,
      }}
    >
      <svg
        className="transform -rotate-90"
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12.068.016l-3.717 3.698 5.263 5.286h-13.614v6h13.614l-5.295 5.317 3.718 3.699 11.963-12.016z" />
      </svg>
    </div>
  );
}

export function Callout(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="flex justify-center align-center p-8 space-x-4"
    />
  );
}

export function Toggle({
  children,
  checked,
  ...props
}: React.HTMLProps<HTMLInputElement>) {
  return (
    <label
      className={classNames(
        "rounded-md shadow flex items-center justify-center p-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10 cursor-pointer",
        checked
          ? "bg-green-800 hover:bg-green-900"
          : "bg-green-500 hover:bg-green-700"
      )}
    >
      {children}
      <input {...props} type="checkbox" checked={checked} className="sr-only" />
    </label>
  );
}

export function Button({
  color = undefined,
  ...props
}: React.HTMLProps<HTMLButtonElement> & { color?: string }) {
  return (
    <button
      {...props}
      type="button"
      className={classNames(
        "rounded-md shadow flex items-center justify-center p-8 py-3 border border-transparent text-base font-medium rounded-md text-white md:py-4 md:text-lg md:px-10",
        color ? color : "bg-green-500 hover:bg-green-700"
      )}
    />
  );
}

export function NumberGrid(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className="mt-12 mb-12 relative grid grid-cols-8 gap-px text-1xl sm:font-thin sm:text-3xl"
    />
  );
}

export function Field({
  fieldType,
  markedAsZero,
  ...props
}: React.HTMLProps<HTMLDivElement> & {
  fieldType: "complete" | "current" | "target" | "default";
  markedAsZero: boolean;
}) {
  return (
    <div
      {...props}
      className={classNames(
        `bg-gray-50 flex items-center justify-center p-4 relative transition`,
        fieldType === "complete"
          ? "bg-green-400 text-white"
          : fieldType === "current"
          ? "bg-blue-400 text-white"
          : fieldType === "target"
          ? "bg-gray-600 text-white"
          : "bg-gray-200 text-gray-800"
      )}
    >
      {props.children}
      {markedAsZero && (
        <div className="absolute -bottom-8 rounded-full bg-gray-300 h-2 w-2" />
      )}
    </div>
  );
}

export function Intro() {
  return (
    <div className="text-center">
      <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
        <span className="block xl:inline">Visual Algorithm</span>
        <span className="block text-green-600 xl:inline">Shift Zeros Left</span>
      </h1>
      <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Given an integer array, move all elements that are 0 to the left while
        maintaining the order of other elements in the array. The array has to
        be modified in-place.
      </p>
    </div>
  );
}

function swap<A>(left: number, right: number, array: A[]) {
  const copy = [...array];
  copy[left] = array[right];
  copy[right] = array[left];
  return copy;
}

const reset = {
  target: "idle",
  actions: "reset",
};

type Events =
  | { type: "START" }
  | { type: "STEP" }
  | { type: "MARK" }
  | { type: "NEXT" }
  | { type: "RESET" }
  | { type: "IS_ZERO" }
  | { type: "IS_NON_ZERO" }
  | { type: "ACKNOWLEDGE_NO_CHANGE" }
  | { type: "SWAP" };

interface Context {
  target: number;
  current: number;
  zeros: number;
  list: { number: number; key: any; markedAsZero: boolean }[];
}

const algorithmMachine = createMachine<Context, Events>(
  {
    id: "algorithm",
    initial: "idle",
    context: {
      target: -1,
      current: 8,
      zeros: 0,
      list: generateList(),
    },
    states: {
      idle: {
        on: {
          START: {
            target: "step",
          },
          RESET: reset,
        },
      },
      step: {
        always: [
          {
            target: "done",
            cond: "isDone",
          },
        ],
        on: {
          STEP: "match",
          RESET: reset,
        },
        entry: ["select", "findTarget"],
      },
      match: {
        on: {
          IS_ZERO: {
            target: "mark",
            actions: "findTarget",
          },
          IS_NON_ZERO: "passthrough",
          RESET: reset,
        },
      },
      passthrough: {
        always: [
          { cond: "hasZeros", target: "swap" },
          { cond: "hasNoZeros", target: "nonZeroInCorrectPosition" },
        ],
      },
      nonZeroInCorrectPosition: {
        on: {
          ACKNOWLEDGE_NO_CHANGE: "next",
        },
      },
      swap: {
        on: {
          SWAP: {
            target: "next",
            actions: "swap",
          },
          RESET: reset,
        },
      },
      mark: {
        on: {
          MARK: "next",
        },
        entry: ["mark"],
      },
      next: {
        on: {
          NEXT: "step",
          RESET: reset,
        },
      },
      done: {
        on: {
          RESET: reset,
        },
      },
    },
  },
  {
    guards: {
      isDone: (context) => context.current < 0,
      hasZeros: (context) => context.zeros !== 0,
      hasNoZeros: (context) => context.zeros === 0,
    },
    actions: {
      reset: assign({
        current: () => 8,
        zeros: () => 0,
        list: () => generateList(),
        target: () => -1,
      }),
      select: assign({ current: (context) => context.current - 1 }),
      mark: assign({
        list: (context) =>
          context.list.map((item, index) =>
            index < context.current || item.number !== 0
              ? item
              : { ...item, markedAsZero: true }
          ),
        zeros: (context) => context.zeros + 1,
      }),
      swap: assign({
        list: (context) =>
          swap(context.current, context.current + context.zeros, context.list),
      }),
      findTarget: assign({
        target: (context) =>
          context.zeros ? context.current + context.zeros : -1,
      }),
    },
  }
);

function getNext(
  state: State<
    Context,
    Events,
    any,
    {
      value: any;
      context: Context;
    }
  >,
  send: (event: Events["type"]) => State<
    Context,
    Events,
    any,
    {
      value: any;
      context: Context;
    }
  >
) {
  return () => {
    switch (state.value) {
      case "idle": {
        send("START");
        break;
      }
      case "step": {
        send("STEP");
        break;
      }
      case "match": {
        if (state.context.list[state.context.current].number === 0) {
          send("IS_ZERO");
        } else {
          send("IS_NON_ZERO");
        }
        break;
      }
      case "pass": {
        send("NEXT");
        break;
      }
      case "swap": {
        send("SWAP");
        break;
      }
      case "next": {
        send("NEXT");
        break;
      }
      case "mark": {
        send("MARK");
        break;
      }
      case "nonZeroInCorrectPosition": {
        send("ACKNOWLEDGE_NO_CHANGE");
        break;
      }
      case "done": {
        send("RESET");
        break;
      }
      default: {
      }
    }
  };
}

export default function App() {
  const [state, send] = useMachine(algorithmMachine);
  const [automated, setAutomated] = React.useState(false);

  const { current, zeros, list, target } = state.context;
  const isDone = current < 0;
  const isOutOfBounds = isDone || current >= 8;

  React.useEffect(() => {
    if (automated) {
      let interval = setInterval(() => {
        getNext(state, send)();
      }, 2500);

      return () => clearInterval(interval);
    }

    return undefined;
  }, [automated, state, send]);

  return (
    <Screen>
      <Intro />
      <NumberGrid>
        <CurrentArrow hide={isOutOfBounds} position={current} />
        <TargetArrow hide={!zeros || isDone} position={target} />

        {list.map(({ key, number, markedAsZero }, index) => {
          return (
            <Field
              key={key}
              markedAsZero={
                !isDone &&
                !!markedAsZero &&
                !(target === index) &&
                !(current === index)
              }
              fieldType={
                isDone
                  ? "complete"
                  : current === index
                  ? "current"
                  : target === index
                  ? "target"
                  : "default"
              }
            >
              {number}
            </Field>
          );
        })}
      </NumberGrid>
      <div className="text-gray-600 font-light p-2 text-center">
        {state.value === "step"
          ? `Let's take a look at current value.`
          : state.value === "match"
          ? `Is this 0?`
          : state.value === "mark"
          ? `Yep, it's a zero. Mark it. We now have ${zeros} zero${
              zeros !== 1 ? "s" : ""
            } in a row.`
          : state.value === "nonZeroInCorrectPosition"
          ? `Nope, not a zero. It is in the right position. Let it be.`
          : state.value === "next"
          ? `We are done with this one. Lets move on.`
          : state.value === "swap"
          ? `Nope, not a zero. It is out of place, let's swap this with the last zero.`
          : state.value === "done"
          ? "😃 Awesome! The list is now in the right order."
          : state.value === "idle"
          ? "Lets get this sorted."
          : ""}
      </div>
      <Callout>
        <Toggle
          checked={automated}
          onChange={() => {
            setAutomated((current) => !current);
          }}
        >
          {automated ? "Enable Manual Control" : "Enable Automated Control"}
        </Toggle>
        {!automated ? (
          <>
            {state.value !== "done" && (
              <Button disabled={automated} onClick={getNext(state, send)}>
                Step
              </Button>
            )}{" "}
            <Button
              disabled={automated}
              color="bg-gray-500 hover:bg-gray-600"
              onClick={() => {
                send("RESET");
              }}
            >
              Reset
            </Button>
          </>
        ) : null}
      </Callout>
      <Code
        highlightedLines={
          state.value === "step"
            ? [13]
            : state.value === "match"
            ? [14]
            : state.value === "mark"
            ? [15]
            : state.value === "nonZeroInCorrectPosition"
            ? [19]
            : state.value === "next"
            ? [20]
            : state.value === "swap"
            ? [0, 1, 2, 3, 4, 5, 6, 7, 17]
            : state.value === "done"
            ? []
            : []
        }
      >
        {`function swap(a, b) {
  return function (array) {
    let temp = array[a];
    array[a] = array[b];
    array[b] = temp;
    return array;
  }
}

function shiftZerosLeft(array) {
  let index = array.length - 1;
  let zeros = 0;

  while (index >= 0) {
    if (array[index] === 0) {
      zeros++;
    } else if (zeros.length > 0) {
      swap(index, index + zeros)(array);
    }
    
    index--;
  }

  return array;
}`.trim()}
      </Code>
      <div className="py-8">
        <h2 className="font-bold mb-2">Real World</h2>
        <p className="mb-4">
          In the real world though I would tend to try and use built in sort
          functions.
        </p>
        <Code>
          {`const sortZerosFirst = (left) => left === 0 ? -1 : 1;
[...base].sort(sortZerosFirst);`}
        </Code>
      </div>
    </Screen>
  );
}
