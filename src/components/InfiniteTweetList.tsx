import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ProfileImage from "./ProfileImage";
import { useSession } from "next-auth/react";
import { VscHeart, VscHeartFilled } from "react-icons/vsc";
import IconHoverEffect from "./IconHoverEffect";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./LoadingSpinner";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";

type Tweet = {
  id: string;
  content: string;
  createdAt: Date;
  likeCount: number;
  likedByMe: boolean;
  user: { id: string; image: string | null; name: string | null };
  bookmarkedByMe: boolean;
  bookmarkCount: number;
};

type Props = {
  isLoading: boolean;
  isError: boolean;
  hasMore: boolean | undefined;
  fetchNewTweets: () => Promise<unknown>;
  tweets?: Tweet[];
};

type HeartButtonProps = {
  likedByMe: boolean;
  likeCount: number;
  isLoading: boolean;
  onClick: () => void;
};

type BookmarkProps = {
  bookmarkedByMe: boolean;
  bookmarkCount: number;
  isLoading: boolean;
  onClick: () => void;
};

const InfiniteTweetList = ({
  tweets,
  isError,
  isLoading,
  fetchNewTweets,
  hasMore = false,
}: Props) => {
  if (isLoading) return <LoadingSpinner />;
  if (isError) return <h1>Error</h1>;
  if (tweets == null || tweets.length === 0) {
    return (
      <h2 className="my-4 text-center text-2xl text-gray-500">No Tweets</h2>
    );
  }
  return (
    <InfiniteScroll
      dataLength={tweets.length}
      next={fetchNewTweets}
      hasMore={hasMore}
      loader={<LoadingSpinner />}
    >
      {tweets.map((tweet) => {
        return <TweetCard key={tweet.id} {...tweet} />;
      })}
    </InfiniteScroll>
  );
};

export default InfiniteTweetList;

function TweetCard({
  content,
  createdAt,
  id,
  likeCount,
  likedByMe,
  user,
  bookmarkCount,
  bookmarkedByMe,
}: Tweet) {
  const trpcUtils = api.useContext();
  const toggleLike = api.tweet.toggleLike.useMutation({
    onSuccess: ({ addedLike }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;
        const countModifier = addedLike ? 1 : -1;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === id) {
                  return {
                    ...tweet,
                    likeCount: tweet.likeCount + countModifier,
                    likedByMe: addedLike,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      ),
        trpcUtils.tweet.inifiniteProfileFeed.setInfiniteData(
          { userId: user.id },
          updateData
        );
    },
  });

  const toggleBookmark = api.tweet.toggleBookmark.useMutation({
    onSuccess: ({ addedBookmark }) => {
      const updateData: Parameters<
        typeof trpcUtils.tweet.infiniteFeed.setInfiniteData
      >[1] = (oldData) => {
        if (oldData == null) return;
        const countModifier = addedBookmark ? 1 : -1;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => {
            return {
              ...page,
              tweets: page.tweets.map((tweet) => {
                if (tweet.id === id) {
                  return {
                    ...tweet,
                    bookmarkCount: tweet.bookmarkCount + countModifier,
                    bookmarkedByMe: addedBookmark,
                  };
                }
                return tweet;
              }),
            };
          }),
        };
      };
      trpcUtils.tweet.infiniteFeed.setInfiniteData({}, updateData);
      trpcUtils.tweet.infiniteFeed.setInfiniteData(
        { onlyFollowing: true },
        updateData
      ),
        trpcUtils.tweet.inifiniteProfileFeed.setInfiniteData(
          { userId: user.id },
          updateData
        );
    },
  });

  function handleToggleLike() {
    toggleLike.mutate({ id });
  }
  function handleToggleBookmark() {
    toggleBookmark.mutate({ id });
  }
  return (
    <li className="flex gap-4 border-b px-4 py-4">
      <Link href={`/profile/${user.id}`}>
        <ProfileImage src={user.image} />
      </Link>
      <div className="flex flex-grow flex-col">
        <div className="flex gap-1">
          <Link
            className="text-xs font-bold outline-none hover:underline focus-visible:underline sm:text-base"
            href={`/profile/${user.id}`}
          >
            {user.name}
          </Link>
          <span className="text-xs text-gray-500 sm:text-base">-</span>
          <span className="text-xs text-gray-500 sm:text-base">
            {dateTimeFormatter.format(createdAt)}
          </span>
        </div>
        <p className="whitespace-pre-wrap text-xs sm:text-base">{content}</p>
        <div className="flex items-center justify-start gap-10">
          <HeartButton
            onClick={() => handleToggleLike()}
            isLoading={toggleLike.isLoading}
            likedByMe={likedByMe}
            likeCount={likeCount}
          />
          <BookMarkButton
            onClick={() => handleToggleBookmark()}
            isLoading={toggleBookmark.isLoading}
            bookmarkedByMe={bookmarkedByMe}
            bookmarkCount={bookmarkCount}
          />
        </div>
      </div>
    </li>
  );
}

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "long",
});

function HeartButton({
  isLoading,
  onClick,
  likedByMe,
  likeCount,
}: HeartButtonProps) {
  const session = useSession();
  const HeartIcon = likedByMe ? VscHeartFilled : VscHeart;

  if (session.status !== "authenticated") {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-xs text-gray-500 sm:text-base">
        <HeartIcon className="h-4 w-4" />
        <span className="text-xs sm:text-base">{likeCount}</span>
      </div>
    );
  }
  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 flex flex-row items-center gap-1 self-start transition-colors duration-200 ${
        likedByMe
          ? "text-red-500"
          : "text-gray-500 hover:text-red-500 focus-visible:text-red-500"
      }`}
    >
      <IconHoverEffect red>
        <HeartIcon
          className={`transition-colors duration-200 ${
            likedByMe
              ? "fill-red-500"
              : "fill-gray-500 group-hover:fill-red-500 group-focus-visible:fill-red-500"
          }`}
        />
      </IconHoverEffect>
      <span>{likeCount}</span>
    </button>
  );
}

function BookMarkButton({
  isLoading,
  onClick,
  bookmarkCount,
  bookmarkedByMe,
}: BookmarkProps) {
  const session = useSession();
  const BookmarkIcon = bookmarkedByMe ? BsFillBookmarkFill : BsBookmark;

  if (session.status !== "authenticated") {
    return (
      <div className="mb-1 mt-1 flex items-center gap-3 self-start text-xs text-gray-500 sm:text-base">
        <BookmarkIcon className="h-4 w-4" />
        <span className="text-xs sm:text-base">{bookmarkCount}</span>
      </div>
    );
  }
  return (
    <button
      disabled={isLoading}
      onClick={onClick}
      className={`group -ml-2 flex flex-row items-center gap-1 self-start transition-colors duration-200 ${
        bookmarkedByMe
          ? "text-blue-500"
          : "text-gray-500 hover:text-blue-500 focus-visible:text-blue-500"
      }`}
    >
      <IconHoverEffect blue>
        <BookmarkIcon
          className={`transition-colors duration-200 ${
            bookmarkedByMe
              ? "fill-blue-500"
              : "fill-gray-500 group-hover:fill-blue-500 group-focus-visible:fill-blue-500"
          }`}
        />
      </IconHoverEffect>
      <span>{bookmarkCount}</span>
    </button>
  );
}
