"use client";
import { useActionState } from "react";
import { updateFormData } from './action';
import { mockedItems } from './mocks';
import { FormState } from './types';

export default function FormDataPage() {
  const [state, formAction] = useActionState<FormState, FormData>(updateFormData, {
    items: mockedItems,
  });
  console.log("re-rendering:", state);
  return (
    <div className="mx-auto mt-12 flex max-w-2xl flex-col justify-center gap-4 border-2 border-gray-300 p-4">
      <form action={formAction} className="flex flex-col justify-center gap-4">
        {state.items.map((item, index) => (
          <div key={item.id}>
            {/* Using index from map to create ordered inputs */}
            <input type="text" name={`items[${index}][name]`} defaultValue={item.name} />
            <input type="hidden" name={`items[${index}][id]`} value={item.id} />
            <input type="hidden" name={`items[${index}][type]`} value={item.type} />
            <input type="number" name={`items[${index}][number]`} defaultValue={item.number} />

            {item.options.map((option, optionIndex) => (
              <div key={option.id}>
                <input type="hidden" name={`items[${index}][options][${optionIndex}][id]`} value={option.id} />
                <input
                  type="hidden"
                  name={`items[${index}][options][${optionIndex}][parentId]`}
                  value={option.parentId}
                />

                <div>
                  <input
                    type="text"
                    name={`items[${index}][options][${optionIndex}][meta][url]`}
                    defaultValue={option.meta.url}
                  />
                  <input
                    type="text"
                    name={`items[${index}][options][${optionIndex}][meta][image]`}
                    defaultValue={option.meta.image}
                  />
                </div>

                <input
                  type="number"
                  name={`items[${index}][options][${optionIndex}][order]`}
                  defaultValue={option.order ?? 0}
                />

                <input
                  type="text"
                  name={`items[${index}][options][${optionIndex}][name][en]`}
                  defaultValue={option.name.en}
                />
                <input
                  type="text"
                  name={`items[${index}][options][${optionIndex}][name][th]`}
                  defaultValue={option.name.th}
                />
              </div>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
