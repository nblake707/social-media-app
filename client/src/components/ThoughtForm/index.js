import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_THOUGHT } from "../../Utils/mutations";
import { QUERY_THOUGHTS, QUERY_ME } from "../../Utils/queries";

const ThoughtForm = () => {
  const [thoughtText, setText] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    // addThought represents the newly created thought
    update(cache, { data: { addThought } }) {
      try {
         // read whats currently in the QUERY_THOUGHTS
         const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });

         // prepend the newest thought to the front of the array
         cache.writeQuery({
           query: QUERY_THOUGHTS,
           data: { thoughts: [addThought, ...thoughts] },
         });

        // update me object's cache, appending new thought to the end of the array
        const { me } = cache.readQuery({ query: QUERY_ME});
        cache.writeQuery({
          query: QUERY_ME,
          data: { me: { ...me, thoughts: [...me.thoughts, addThought] } } // possible issue here 
        });
      } catch (e) {
        console.log(e);
      }
    },
    // this function makes it possible to update thoughts on homepage without refresh
  });

  // stops updating the value of thoughtText once the character count reaches 280
  const handleChange = (event) => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };

  // async bc it calls a mutation
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      // add thought to database
      await addThought({
        variables: { thoughtText },
      });

      // clear form value
      setText("");
      setCharacterCount(0);
    } catch (e) {
      console.log(e);
    }

    // console.log(error);
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? "text-error" : ""}`}>
        Character Count: {characterCount}/280
        {error && (
          <span className="ml-2 text-error">Something went Wrong...</span>
        )}
      </p>
      <form
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;
