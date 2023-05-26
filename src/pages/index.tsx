import { type NextPage } from "next";
import TweetForm from "~/components/TweetForm";
import InfiniteTweetList from "~/components/InfiniteTweetList";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { useTheme } from "next-themes";

const TABS = ["Recent", "Following"] as const;

const Home: NextPage = () => {
  const [selectedTab, setSelectedTab] =
    useState<(typeof TABS)[number]>("Recent");
  const session = useSession();
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  return (
    <>
      <header className="sticky top-0 z-10 border-b bg-white pt-2 text-black dark:bg-[#121212] dark:text-white">
        <div className="flex w-full items-center justify-between">
          <h1 className="mb-2 px-4 text-lg font-bold">Home</h1>
          <span className="mb-2 px-4">
            <BsFillSunFill
              onClick={() =>
                theme == "dark" ? setTheme("light") : setTheme("dark")
              }
              className={` ${
                theme === "dark" ? "hidden" : "block"
              } h-6 w-6 cursor-pointer sm:w-12  sm:w-12 `}
            />
            <BsFillMoonFill
              onClick={() =>
                theme == "dark" ? setTheme("light") : setTheme("dark")
              }
              className={`h-6 w-6 cursor-pointer sm:w-12 ${
                theme === "dark" ? "block" : "hidden"
              } sm:w-12 `}
            />
          </span>
        </div>

        {session.status === "authenticated" && (
          <div className="flex">
            {TABS.map((tab) => {
              return (
                <button
                  onClick={() => setSelectedTab(tab)}
                  key={tab}
                  className={`flex-grow p-2 hover:bg-gray-200 focus-visible:bg-gray-200 dark:hover:bg-gray-700 ${
                    tab === selectedTab
                      ? "border-b-4 border-b-blue-500 font-bold"
                      : " "
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </header>
      <TweetForm />
      {selectedTab === "Recent" ? <RecentTweets /> : <FollowingTweets />}
    </>
  );
};

export default Home;

function RecentTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    {},
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}

function FollowingTweets() {
  const tweets = api.tweet.infiniteFeed.useInfiniteQuery(
    { onlyFollowing: true },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <InfiniteTweetList
      tweets={tweets.data?.pages.flatMap((page) => page.tweets)}
      isError={tweets.isError}
      isLoading={tweets.isLoading}
      hasMore={tweets.hasNextPage}
      fetchNewTweets={tweets.fetchNextPage}
    />
  );
}
