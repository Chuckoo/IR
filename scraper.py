from dotenv import dotenv_values
import praw
import pandas as pd
import json
import logging

logging.basicConfig(filename='status',
                    filemode='a',
                    format='%(asctime)s,%(msecs)d %(name)s %(levelname)s %(message)s',
                    datefmt='%H:%M:%S',
                    level=logging.INFO)

config = dotenv_values(".env")

df = pd.read_csv("worldcities.csv")

reddit = praw.Reddit(client_id=config['client_id'], client_secret=config['client_secret'], user_agent=config['user_agent'])

try:
    for index, row in df.iterrows():
        subreddit = reddit.subreddit('travel')
        search_query = row['city_ascii']

        submissions = subreddit.search(query=search_query, sort='top', time_filter='all', limit=1)
        thread_ids = []
        thread_titles = []
        thread_urls = []
        thread_contents = []
        thread_author = []
        thread_created_utc = []
        thread_subreddit_id = []
        thread_subreddit = []
        comments_all = []

        for submission in submissions:
            comments_list = []
            thread_ids.append(submission.id)
            thread_subreddit.append(submission.subreddit)
            thread_author.append(submission.author.name if submission.author else '[deleted]',)
            thread_titles.append(submission.title)
            thread_contents.append(submission.selftext)
            thread_urls.append(submission.url)
            thread_created_utc.append(submission.created_utc)
            thread_subreddit_id.append(submission.subreddit_id)
            
            counter = 0
            try:
                for comment in submission.comments:
                    if counter == 10:
                        break
                    counter +=1
                    comments_list.append({
                        'id': comment.id,
                        'post_id': submission.id,
                        'comment': comment.body,
                        'author': comment.author.name if comment.author else '[deleted]',
                        'created_at': comment.created_utc
                    })
            except AttributeError as e:
                pass

            comment_dict = json.dumps({"comments": comments_list})
            comments_all.append(comment_dict)

        post_data = {
            'id': thread_ids,
            'title': thread_titles,
            'url': thread_urls,
            'content': thread_contents,
            'author': thread_author,
            'created_at': thread_created_utc,
            'subreddit': thread_subreddit,
            'subreddit_id': thread_subreddit_id,
            'comments': comments_all,
            'city':row['city_ascii'],
            'lat':row['lat'],
            'lng':row['lng']
        }

        post_df = pd.DataFrame(post_data)

        post_df.to_csv('travel_posts_data.csv', mode = 'a', header=True, index=False)

        logging.error(str(row['city_ascii']) + " SUCCESS - "  + str(len(post_df)))
except:
    logging.error(str(row['city_ascii']) + " FAILED")