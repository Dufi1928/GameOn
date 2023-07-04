import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StyleSheet, ScrollView, View, Text, useWindowDimensions, Image } from 'react-native';
import RenderHtml from 'react-native-render-html';

interface Comment {
    id: number;
    author: Author;
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

interface BlogPageProps {
    route: { params: { blogId: number } };
}

export function BlogPage({ route }: BlogPageProps) {
    const { blogId } = route.params;
    const [blogDetails, setBlogDetails] = useState<BlogPost | null>(null);
    const { width } = useWindowDimensions();

    useEffect(() => {
        const fetchBlogPost = async () => {
            try {
                const response = await axios.post(
                    'https://da44-2a01-cb0c-9e3-3600-4494-1d7e-b9c4-dc6d.ngrok-free.app/api/blog',
                    { id: blogId }
                );
                setBlogDetails(response.data);
                console.log(blogDetails);
            } catch (error) {
                console.error(`Failed to fetch blog post with id ${blogId}:`, error);
            }
        };

        fetchBlogPost();
    }, [blogId]);

    if (!blogDetails) {
        return <Text>Loading...</Text>;
    }
    const imgURL = blogDetails.large_photo.replace(
        'localhost:8000',
        'da44-2a01-cb0c-9e3-3600-4494-1d7e-b9c4-dc6d.ngrok-free.app'
    );
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{blogDetails.title}</Text>
            <Image source={{ uri: imgURL }} style={styles.img} />
            <RenderHtml
                contentWidth={width}
                source={{ html: blogDetails.content }}
                tagsStyles={{
                    p: { color: '#9795B5',marginLeft: 20, marginRight: 20},
                    'blockquote cite': { color: '#9795B5' },
                }}
            />
            {/* Map over comments and render each comment */}
            {blogDetails.comments.map((comment) => (
                <View style={styles.commentContainer} key={comment.id}>
                    <Text style={{ color: '#9795B5', fontWeight: 'bold' }}>Author: {comment.author.pseudo}</Text>
                    <Text style={{ color: '#9795B5',marginTop: 20, fontWeight: 'bold' }}>Author: {comment.content}</Text>

                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#221C3E',
    },
    title: {
        color: '#8D8DDA',
        marginLeft: 15,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        marginTop: 30,
    },
    img: {
        width: '95%',
        alignSelf: 'center',
        borderRadius: 30,
        height: 200,
        shadowColor: 'rgba(116, 86, 208, 0.68)',
        shadowOpacity: 1,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 48
    },
    commentContainer: {
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        color: '#9795B5',
    },
    commentContent: {
        marginLeft: 20,
        marginRight: 20,
        color: '#9795B5',
    },
});
