import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../scss/App.scss';
import './Blog.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useParams } from "react-router-dom";
import { MdOutlineDateRange, MdOutlineMessage } from "react-icons/md";

interface Comment {
    id: number;
    author: Author;  // not Author[]
    content: string;
    created_at: string;
}

interface Author {
    pseudo: string;
    avatar: string;
}

interface BlogPost {
    id: number;
    num_comments: number;
    title: string;
    large_photo: string;
    content: string;
    created_at: string;
    small_photo: string;
    comments: Comment[];
}


const Blog: React.FC = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const { id } = useParams<{id: string}>();// accessing id from URL parameters

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                const response = await axios.post('https://mygameon.pro:8000/api/blog',
                    { id }, // sending id in the body of the request
                    { withCredentials: true },
                );
                console.log(response.data);
                setBlogPosts([response.data]); // wrap the data into array since your state expects an array
                console.log(blogPosts)
            } catch (error) {
                console.error(`Failed to fetch blog post with id ${id}:`, error);
            }
        };

        fetchBlogPost();
    }, [id]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'MMMM dd, yyyy');
    };


    return (
        <div className="container">
            <Header />
            <div className="unique-blog-page">
                {blogPosts.map((post) => (
                    <div key={post.id}>
                        <div className="photo-container">
                            <img src={post.large_photo} alt=""/>
                        </div>
                        <div className="title-container">
                            <h1>{post.title}</h1>
                            <div className="title-futter">
                                <MdOutlineDateRange className="title-futter-icon"/>
                                <span>{formatDate(post.created_at)}</span>
                                <MdOutlineMessage className="title-futter-icon"/>
                                <span>{post.comments.length}</span>
                            </div>
                        </div>
                        <div className="content-container" dangerouslySetInnerHTML={{ __html: post.content }} />
                        <div className="comments-container">
                            {post.comments && post.comments.slice(-5).map((comment) => (
                                <>
                                    <div className="comment-container-box" key={comment.id}>
                                        <div className="user-info-box">
                                            <div className="comment-ava-box">
                                                <img src={comment.author.avatar} alt=""/>
                                            </div>
                                            <div className="pseudo-box">
                                                <h2>{comment.author.pseudo}</h2>
                                            </div>
                                        </div>
                                        <div className="comment-box">
                                            <div className="comment-content">
                                                <p>{comment.content}</p>
                                                <p className="metadata"><MdOutlineDateRange className="title-futter-icon"/> {formatDate(comment.created_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>

                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default Blog;


// <img src={post.large_photo} alt={post.title} />
//                     <p>{post.content}</p>
//                     <p>Posted on: {formatDate(post.created_at)}</p>
