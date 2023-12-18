import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { RxChevronDown } from "react-icons/rx";
import Jazzicon from "react-jazzicon";
import { importKey } from "../tauri";

const people = [
  { name: "Wade Cooper" },
  { name: "Arlene Mccoy" },
  { name: "Devon Webb" },
  { name: "Tom Cook" },
  { name: "Tanya Fox" },
  { name: "Hellen Schmidt" },
];

export default function AccountSelector() {
  const [accounts, setAccounts] = useState<KeyPair[]>([]);
  const [selected, setSelected] = useState(people[0]);

  const importFromPrivateKey = async (privateKey: string) => {
    const result = await importKey(privateKey);
    console.log(result);
  };

  return (
    <div className="absolute top-5 left-0 right-0 flex justify-center">
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1 w-52">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-slate-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <div className="flex items-center space-x-5">
              <Jazzicon
                diameter={24}
                seed={Math.round(Math.random() * 1000000000)}
              />
              <span className="block truncate">{selected.name}</span>
            </div>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <RxChevronDown
                className="h-5 w-5 text-primary"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="max-h-72">
              <button
                onClick={() =>
                  importFromPrivateKey(
                    "d500266f7d37f0957564e4ce1a1dcc8bb3408383634774a2f4a94a35f4bc53e0"
                  )
                }
              >
                Add account
              </button>
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-slate-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                {people.map((person, personIdx) => (
                  <Listbox.Option
                    key={personIdx}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? "bg-slate-500 text-amber-900" : "text-gray-900"
                      }`
                    }
                    value={person}
                  >
                    {({ selected }) => (
                      <div className="flex items-center space-x-5">
                        <Jazzicon diameter={24} seed={99999999} />
                        <span
                          className={`block truncate ${
                            selected ? "font-medium" : "font-normal"
                          }`}
                        >
                          {person.name}
                        </span>
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </div>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
