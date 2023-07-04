import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../scss/App.scss';
import './BlogList.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
    id: number;
    num_comments: number;
    title: string;
    large_photo: string;
    content: string;
    created_at: string;
    small_photo: string;
}


const BlogList: React.FC = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const navigate = useNavigate();
    const handleBlogClick = (id: number) => {
        navigate(`/blog/${id}`);
    };

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await axios.get('https://mygameon.pro:8000/api/blogList', {
                    withCredentials: true,
                });
                console.log(response.data);
                setBlogPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchBlogPosts();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'MMMM dd, yyyy');
    };

    return (
        <div className="pblog-age">
            <Header />
            <div className="blogExemple">
                <div className="leftSideBlogExample">
                    <h3>Le phénomène de l'eSport : League of Legends au sommet de la compétition mondiale !</h3>
                    <p>
                        Plongez dans l'univers compétitif de League of Legends, où les joueurs deviennent des légendes de l'eSport.
                        Des affrontements épiques, des stratégies élaborées et ...
                    </p>
                    <button>Lire la suite</button>
                </div>

                <div className="rightSideBlogExample">
                    <div className="imageBox">
                        <img src="/img/Blog.png" alt="" />
                    </div>
                </div>
            </div>

            <div className="pageWrapper">
                {blogPosts.map((post) => (
                    <div key={post.id} onClick={() => handleBlogClick(post.id)} className="blogCard" >
                        <div className="cardInner">
                            <p className="blogTitle">{post.title}</p>
                            <p className="blogDate">
                                {formatDate(post.created_at)}
                                {post.num_comments !== 0 && (
                                    <span>   {post.num_comments} {post.num_comments === 1 ? ' comment' : ' comments'}</span>
                                )}
                            </p>
                            <div className="cardImgBox">
                                <img src={post.small_photo} alt="" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default BlogList;
