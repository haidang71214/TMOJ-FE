import { CommentData } from "./types";

export const INITIAL_DATA: CommentData[] = [
  {
    id: 1,
    user: "Mikhail Lachikhin",
    date: "Nov 19, 2019",
    content:
      "Hello there. This is my first time solving problems on leetcode and I ran into a problem...",
    likes: 71,
    isLiked: false,
    isDisliked: false,
    repliesCount: 2,
    replies: [
      {
        id: 101,
        user: "nishad78",
        date: "Dec 04, 2024",
        content:
          "You must NOT write any of this in LeetCode: input(), print(). LeetCode calls your function directly with the test case arguments.",
        likes: 12,
        isLiked: false,
        isDisliked: false,
        color: "bg-gray-200",
      },
      {
        id: 102,
        user: "nifemi9000",
        date: "Jul 24, 2024",
        content:
          "You don't have to convert the result into a list manually, returning [i, j] is sufficient in Python.",
        likes: 5,
        isLiked: false,
        isDisliked: false,
        color: "bg-gray-200",
      },
    ],
    color: "bg-green-600 text-white",
  },
  {
    id: 2,
    user: "Ivan Kvas",
    date: "Jan 14, 2019",
    title: "Python One-pass Hash Map",
    content:
      "One-pass Hash Map approach is very efficient as it only iterates through the list once. Time Complexity: O(n), Space Complexity: O(n).",
    code: `class Solution(object):\n    def twoSum(self, nums, target):\n        hash_map = dict()\n        for index, val in enumerate(nums):\n            diff = target - val\n            if diff in hash_map:\n                return [hash_map[diff], index]\n            hash_map[val] = index`,
    likes: 125,
    isLiked: false,
    isDisliked: false,
    color: "bg-gray-500 text-white",
  },
  {
    id: 3,
    user: "Adarsh Naidu",
    date: "Oct 20, 2018",
    content:
      "How to view the solution in C++? I can only see Java and Python in the editorial.",
    likes: 1500,
    isLiked: false,
    isDisliked: false,
    repliesCount: 1,
    replies: [
      {
        id: 301,
        user: "helper_bot",
        date: "Oct 21, 2018",
        content:
          "You can click on the language dropdown in the code editor to see available languages.",
        likes: 45,
        isLiked: false,
        isDisliked: false,
        color: "bg-blue-100",
      },
    ],
    color: "bg-orange-500 text-white",
  },
  {
    id: 4,
    user: "apollopower",
    date: "Sep 05, 2018",
    title: "C++ unordered_map approach",
    content:
      "Using unordered_map provides O(1) average time complexity for lookups.",
    code: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> indices;\n        for (int i = 0; i < nums.size(); i++) {\n            if (indices.find(target - nums[i]) != indices.end()) {\n                return {indices[target - nums[i]], i};\n            }\n            indices[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
    likes: 4800,
    isLiked: false,
    isDisliked: false,
    color: "bg-blue-400 text-white",
  },
  {
    id: 5,
    user: "algo_expert",
    date: "Jan 10, 2025",
    content:
      "Don't forget that if the array is sorted, you could potentially use the Two Pointers approach with O(1) space (excluding sorting).",
    likes: 89,
    isLiked: false,
    isDisliked: false,
    color: "bg-purple-600 text-white",
  },
];
