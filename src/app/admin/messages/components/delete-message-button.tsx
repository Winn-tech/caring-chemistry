"use client";

import { deleteMessage } from "../actions";

/** Deleting can't be undone, so ask first. */
export function DeleteMessageButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteMessage}
      onSubmit={(event) => {
        if (!window.confirm(`Delete the message from ${name}? This can't be undone.`)) event.preventDefault();
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button className="text-sm font-medium text-red-700 underline-offset-4 hover:text-red-800 hover:underline" type="submit">Delete</button>
    </form>
  );
}
