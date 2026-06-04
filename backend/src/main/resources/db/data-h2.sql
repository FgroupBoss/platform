INSERT INTO poem (id, title, author, dynasty, lines, pinyin, translation, difficulty, tags, status, sort_order)
VALUES (
    1,
    '静夜思',
    '李白',
    '唐',
    '["床前明月光","疑是地上霜","举头望明月","低头思故乡"]',
    '["chuáng qián míng yuè guāng","yí shì dì shàng shuāng","jǔ tóu wàng míng yuè","dī tóu sī gù xiāng"]',
    '明亮的月光照在床前，好像地上铺了一层白霜。抬头看天上的明月，低头思念故乡。',
    'easy',
    '["名篇","思乡"]',
    'published',
    1
);

INSERT INTO poem (id, title, author, dynasty, lines, translation, difficulty, tags, status, sort_order)
VALUES (
    2,
    '咏鹅',
    '骆宾王',
    '唐',
    '["鹅，鹅，鹅","曲项向天歌","白毛浮绿水","红掌拨清波"]',
    '鹅鹅鹅，弯着脖子向天欢唱。洁白的羽毛漂浮在碧绿的水面，红红的脚掌拨动着清清的水波。',
    'easy',
    '["名篇"]',
    'published',
    2
);

INSERT INTO story (id, title, story_type, paragraphs, age_min, status, sort_order)
VALUES (
    1,
    '龟兔赛跑',
    '寓言',
    '["森林里要举行跑步比赛，参赛的是跑得飞快的兔子和爬得慢吞吞的乌龟。","兔子觉得自己稳赢，比赛开始后一会儿就跑得很远，然后在一棵大树下睡起了觉。","乌龟一步一步坚持向前，没有停下来休息。","等兔子醒来时，乌龟已经快到终点了。兔子拼命追赶，但还是输了。","这个故事告诉我们：骄傲使人落后，坚持才能成功。"]',
    3,
    'published',
    1
);
