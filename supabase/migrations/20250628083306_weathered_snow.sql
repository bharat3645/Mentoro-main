/*
  # Seed Data for AI Companion Quest

  1. Default themes
  2. Sample flashcards
  3. Sample coding problems
*/

-- Insert default themes
INSERT INTO themes (id, name, description, colors, xp_required, rarity) VALUES
('dark', 'Neon Dark', 'The classic dark theme with neon accents', 
 '{"primary": "#8B5CF6", "secondary": "#06B6D4", "accent": "#EC4899", "background": "#0f172a"}', 
 0, 'common'),
('cyberpunk', 'Cyberpunk', 'Futuristic theme with electric blues and magentas',
 '{"primary": "#7209b7", "secondary": "#2d1b69", "accent": "#f72585", "background": "#1a0b2e"}',
 500, 'rare'),
('matrix', 'Matrix', 'Green-on-black terminal aesthetic',
 '{"primary": "#00ff00", "secondary": "#008f11", "accent": "#00ff41", "background": "#000000"}',
 1000, 'epic'),
('sunset', 'Sunset Coder', 'Warm oranges and purples for evening coding',
 '{"primary": "#ff6b35", "secondary": "#f7931e", "accent": "#9d4edd", "background": "#1a1a2e"}',
 1500, 'epic'),
('ocean', 'Deep Ocean', 'Calming blues and teals for focused coding',
 '{"primary": "#16537e", "secondary": "#1e6091", "accent": "#06b6d4", "background": "#0f3460"}',
 2000, 'legendary');

-- Insert sample flashcards
INSERT INTO flashcards (question, answer, category, difficulty, rarity, xp_value, tags) VALUES
('What is the time complexity of binary search?', 
 'O(log n) - Binary search eliminates half of the remaining elements in each iteration by comparing the target with the middle element.',
 'Algorithms', 'medium', 'common', 50, ARRAY['algorithms', 'complexity', 'search']),

('What does CSS stand for?',
 'Cascading Style Sheets - A language used to describe the presentation and styling of HTML documents.',
 'Web Development', 'easy', 'common', 25, ARRAY['css', 'web', 'styling']),

('Explain closures in JavaScript',
 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. This allows for data privacy and function factories.',
 'JavaScript', 'hard', 'epic', 150, ARRAY['javascript', 'closures', 'scope']),

('What is the difference between SQL and NoSQL databases?',
 'SQL databases are relational with structured schemas and ACID compliance, while NoSQL databases are non-relational with flexible schemas, designed for scalability and varied data types.',
 'Databases', 'medium', 'rare', 75, ARRAY['databases', 'sql', 'nosql']),

('What is React Virtual DOM?',
 'A JavaScript representation of the real DOM kept in memory. React uses it to optimize rendering by calculating the minimum changes needed and updating only those parts of the real DOM.',
 'React', 'medium', 'rare', 75, ARRAY['react', 'virtual-dom', 'performance']),

('What is Big O notation?',
 'A mathematical notation used to describe the upper bound of an algorithm''s time or space complexity in terms of input size, helping analyze algorithm efficiency.',
 'Algorithms', 'medium', 'common', 60, ARRAY['algorithms', 'complexity', 'big-o']),

('What is the difference between let, const, and var in JavaScript?',
 'var is function-scoped and can be redeclared; let is block-scoped and can be reassigned but not redeclared; const is block-scoped and cannot be reassigned or redeclared.',
 'JavaScript', 'easy', 'common', 30, ARRAY['javascript', 'variables', 'scope']),

('What is a REST API?',
 'Representational State Transfer - An architectural style for web services that uses HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URLs.',
 'Web Development', 'medium', 'common', 55, ARRAY['api', 'rest', 'http']),

('What is the purpose of useEffect in React?',
 'useEffect is a React Hook that lets you perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM.',
 'React', 'medium', 'rare', 70, ARRAY['react', 'hooks', 'useeffect']),

('What is recursion?',
 'A programming technique where a function calls itself to solve a problem by breaking it down into smaller, similar subproblems. Must have a base case to prevent infinite loops.',
 'Programming Concepts', 'medium', 'common', 65, ARRAY['recursion', 'algorithms', 'programming']);

-- Insert sample coding problems for battles
INSERT INTO matches (id, creator_id, problem_title, problem_description, difficulty, xp_wager, status, test_cases, starter_code, solution) VALUES
(uuid_generate_v4(), null, 'Two Sum', 
'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
'easy', 150, 'template',
'[
  {"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"},
  {"input": "nums = [3,2,4], target = 6", "output": "[1,2]"},
  {"input": "nums = [3,3], target = 6", "output": "[0,1]"}
]'::jsonb,
'def two_sum(nums, target):
    # Your code here
    pass',
'def two_sum(nums, target):
    num_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in num_map:
            return [num_map[complement], i]
        num_map[num] = i
    return []'),

(uuid_generate_v4(), null, 'Reverse String',
'Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.

Example:
Input: s = ["h","e","l","l","o"]
Output: ["o","l","l","e","h"]',
'easy', 100, 'template',
'[
  {"input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]", "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]"},
  {"input": "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]", "output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]"}
]'::jsonb,
'def reverse_string(s):
    # Your code here
    pass',
'def reverse_string(s):
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1'),

(uuid_generate_v4(), null, 'Valid Parentheses',
'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example:
Input: s = "()[]{}"
Output: true',
'medium', 250, 'template',
'[
  {"input": "s = \"()\"", "output": "true"},
  {"input": "s = \"()[]{}\"", "output": "true"},
  {"input": "s = \"(]\"", "output": "false"},
  {"input": "s = \"([)]\"", "output": "false"}
]'::jsonb,
'def is_valid(s):
    # Your code here
    pass',
'def is_valid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    return not stack');