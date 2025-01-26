This project focused on creating a travel-focused search engine by collecting and processing Reddit posts from subreddits like "r/travel," "r/japanesetravel," and "r/europetravel." Since Reddit lacks geotagged data, a geotagging process was implemented using a dataset of popular cities and destinations to identify location-specific posts.

The data extraction was performed using the Reddit API (PRAW) in Python, yielding 800 MB of raw data, which was cleaned and deduplicated to 500 MB. The crawling process took two days due to API rate limits. The search engine provides users with relevant travel posts and their associated locations.

Project Demo: https://drive.google.com/file/d/1Fix_T7wRqXD2s0Son3y5iCR0KihDcYy-/view

![alt text](https://github.com/Chuckoo/IR/blob/main/1.png)
![alt text](https://github.com/Chuckoo/IR/blob/main/2.png)
![alt text](https://github.com/Chuckoo/IR/blob/main/3.png)

Overview of system:
Architecture:
Our system architecture comprises two fundamental components: the BERT indexer and the web application interface. The BERT indexer utilizes a pre-trained BERT model, specifically distilroberta, to generate dense embeddings from input data. These embeddings are created by ingesting data in batches, tokenizing it, and encoding it using the BERT tokenizer. The resulting embeddings are then indexed using FAISS, facilitating fast retrieval of relevant information based on similarity metrics. Indexed embeddings are stored in a file for future retrieval.
The web application, developed using React JS for the frontend and Flask for the backend server, offers users the flexibility to choose between two indexing methods: Pylucene or BERT. Users can also specify the fields they want to search within, such as title, content, or URL. Upon entering a query and clicking the search icon, the query parameters, along with the index type, are sent to the Flask server. The flask server serves the already built react app in the “/” endpoint, hence there is no need to build and run the react app.

The Flask server hosts two endpoints, one for Pylucene and the other for BERT, enabling retrieval of results based on the selected indexing method. For Pylucene queries, results are fetched directly from the Lucene indexer. However, for BERT queries, the BERT indexer retrieves relevant embeddings from the FAISS index and ranks them based on cosine similarity. Users receive the top 20 results, presented in a card format via the web application interface for easy viewing and exploration.

In addition to search functionality, our web application enriches the user experience by including additional information. Alongside the title, users can view images from the Reddit post (if available) and a snippet of the post content. This combination of multimedia and textual content enhances the context and relevance of the search results. Furthermore, the latitude and longitude of the tourist destination mentioned in the post are provided, making the data highly informative and accessible for users. 

If users wish to explore further, they can click on the card to view the full content, which opens a new tab with the Reddit post displayed. This allows for a more comprehensive understanding of the information presented. Additionally, users have the option to enlarge the Google map displayed with a marker to view other nearby places surrounding the tourist destination. This feature enhances the spatial context of the search results, enabling users to better visualize and explore related locations. Together, these features contribute to a comprehensive and user-friendly experience, empowering users to efficiently access and engage with the provided data.


Details of how BERT was used:

We have utilized a BERT-based model, specifically "all-distilroberta-v1", to generate embeddings for Reddit posts. This model, accessed through the Hugging Face Transformers library, played a pivotal role in our process. Leveraging the FAISS library, we efficiently navigated through extensive collections of embeddings, indexing those produced by BERT. These embeddings were already indexed using FAISS, as we loaded the index from a pre-existing file.
When a user inputs a search query, the same BERT model converts it into an embedding. Subsequently, FAISS employs this embedding to search through the indexed embeddings. The top 20 most similar embeddings, corresponding to the most comparable Reddit posts in the collection, are retrieved and presented in the user interface along with their post text and matching distance score (similarity score).
Our methodology relies on Faiss for finding related documents based on a query. Faiss is a library designed for similarity search and clustering of dense vectors. We imported the transformers library for BERT and Faiss for similarity search. After loading the BERT model and tokenizer from the Hugging Face transformers library, we created a Faiss index for similarity searching.
Using the BERT model, we processed Reddit posts in batches, transforming each post into an embedding vector. We then updated the Faiss index to include these embeddings for similarity search. Additionally, our script incorporates a method for converting a query into an embedding vector, which is then used to search the Faiss index for documents comparable to the query. Finally, the top 20 Reddit posts most similar to the query are printed for user reference.


BERT Indexing:
We create an index of BERT embeddings for a dataset consisting of Reddit posts, employing the FAISS package for efficient indexing. Utilizing the "all-distilroberta-v1" BERT model and tokenizer, we generate embeddings from the input posts. The "distilroberta-base" model and tokenizer are a compact and efficient variant of the RoBERTa architecture developed by Hugging Face. The final hidden state output from the model serves as the basis for these embeddings.

When a user enters a search term, we convert it into a BERT embedding using the same model and tokenizer. Subsequently, we compute the cosine similarity between the query embedding and the embeddings of all indexed posts to identify the most relevant documents. The documents with the highest cosine similarity scores are considered the most pertinent to the query and are presented accordingly.

To optimize processing, we segment the input documents (post titles and content) into passages based on a specified batch size. These passages are then encoded in batches using a transformer model from the Hugging Face library. The resulting embeddings are used to construct a FAISS index, which is subsequently written to disk along with the embeddings. This process continues until all posts have been processed.

For search queries, we encode the input query using the same transformer model and utilize it to search the FAISS index for passages with the highest similarity. These passages are retrieved and presented as the search output. By employing a nearest neighbor search technique, we efficiently segment input documents into passages, facilitating faster retrieval and analysis.


Lucene Indexing:

The Lucene-based search functionality within our application serves the purpose of retrieving relevant information from the indexed Reddit posts. When a GET request is made to the '/lucene' endpoint, the searchlucene() function is invoked. This function begins by initializing the Lucene environment and extracting the user's search query and the specified field to search within (defaulting to 'TITLE' if not provided) from the request parameters.

Users interact with the React Web UI to initiate searches, where they have the capability to conduct searches within either the 'TITLE' or 'CONTENT' fields, both of which are indexed for efficient retrieval. This selection is facilitated through the query parameter named 'search'. When a search is initiated, the chosen field and the search query itself are passed as parameters in the request. This allows users to specify the field they want to search within, whether it's the title or the content of the Reddit posts, ensuring flexibility and precision in the search process.

Next, the function constructs the path to the Lucene index directory and initializes a SimpleFSDirectory object to represent the index directory on the filesystem. An IndexSearcher instance is created to search the index, utilizing a DirectoryReader to open the Lucene index stored in the specified directory.

To parse the user's query and search within the specified field, a QueryParser is instantiated with the chosen field and an EnglishAnalyzer for text analysis. The user's query string is then parsed using this parser to generate a parsed_query object.

With the parsed query in hand, the searcher executes the search against the Lucene index, retrieving the top 20 documents (or fewer if there are fewer matching documents). For each document in the search results, relevant information such as the document's ID, title, content, URL, latitude, longitude, author, and subreddit is extracted from the Lucene index and assembled into a list of dictionaries (topkdocs).

Finally, the search results are returned as a JSON response, containing the list of dictionaries representing the top matching documents, along with their respective scores and metadata such as title, content, URL, and geographic coordinates. This response provides users with the relevant information retrieved from the indexed Reddit posts based on their search query and chosen field.
