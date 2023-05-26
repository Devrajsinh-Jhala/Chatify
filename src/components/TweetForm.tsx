import { useSession } from "next-auth/react";
import React, {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Button from "~/components/Button";
import ProfileImage from "~/components/ProfileImage";
import { api } from "~/utils/api";

type Props = {};

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return null;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

function Form() {
  const session = useSession();
  const [input, setInput] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>();
  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);
  const trpcUtils = api.useContext();
  useLayoutEffect(() => {
    updateTextAreaSize(textAreaRef.current);
  }, [textAreaRef]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      setInput("");
      if (session.status !== "authenticated") return;
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, (oldData) => {
        if (oldData == null || oldData.pages[0] == null) return;

        const newCacheTweet = {
          ...newTweet,
          likeCount: 0,
          likedByMe: false,
          user: {
            id: session.data.user.id,
            name: session.data.user.name || null,
            image: session.data.user.image || null,
          },
        };
        return {
          ...oldData,
          pages: [
            {
              ...oldData.pages[0],
              tweets: [newCacheTweet, ...oldData.pages[0].tweets],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    },
  });
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    createTweet.mutate({ content: input });
  }
  if (session.status !== "authenticated") return null;

  return (
    <form
      action=""
      onSubmit={(e) => handleSubmit(e)}
      className="flex flex-col gap-2 border-b px-4 py-2"
    >
      <div className="flex gap-4">
        <ProfileImage src={session.data.user.image} />
        <textarea
          ref={inputRef}
          style={{ height: 0 }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
          placeholder="What's your take?"
          name=""
          id=""
          cols={30}
          rows={10}
        />
      </div>
      <Button className="self-end">Post</Button>
    </form>
  );
}

const TweetForm = (props: Props) => {
  const session = useSession();
  if (session.status !== "authenticated") return null;
  return <Form />;
};

export default TweetForm;
