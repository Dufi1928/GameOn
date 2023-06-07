import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../scss/App.scss';
import './Blog.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

interface BlogPost {
    id: number;
    num_comments: number;
    title: string;
    large_photo: string;
    content: string;
    created_at: string;
}

const Blog: React.FC = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await axios.get('https://localhost:8000/api/blogList/', {
                    withCredentials: true,
                });
                setBlogPosts(response.data);
            } catch (error) {
                console.error('Failed to fetch blog posts:', error);
            }
        };

        fetchBlogPosts();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return format(date, 'MMMM dd, yyyy');
    };

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const filteredBlogPosts = blogPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pblog-age">
            <Header />
            <div className="blogExemple">
                <div className="leftSideBlogExample">
                    <h3>
                        Le phénomène de l'eSport : League of Legends au sommet de la compétition mondiale !
                    </h3>
                    <p>
                        Plongez dans l'univers compétitif de League of Legends, où les joueurs deviennent des légendes de l'eSport. Des affrontements épiques, des stratégies élaborées et ...
                    </p>
                    <button>
                        Lire la suite
                    </button>
                </div>

                <div className="rightSideBlogExample">
                    <div className="imageBox">
                        <img src="/img/Blog.png" alt=""/>
                    </div>
                </div>

            </div>


            <div className="searchBar">
                {/*<input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearch} />*/}
            </div>
            <div className="pageWrapper">
                {filteredBlogPosts.map((post) => (
                    <div key={post.id} className="blogCard">
                        <div className="cardInner">
                            <p className="blogTitle">{post.title}</p>
                            <p className="blogDate">
                                {formatDate(post.created_at)}
                                {post.num_comments !== 0 && (
                                    <span>   {post.num_comments} {post.num_comments === 1 ? ' comment' : ' comments'}</span>
                                )}
                            </p>
                            <div className="cardImgBox">
                                <img src={post.large_photo} alt="" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

export default Blog;
