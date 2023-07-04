import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

interface BlogPost {
    id: number;
    num_comments: number;
    title: string;
    large_photo: string;
    content: string;
    created_at: string;
    small_photo: string;
}

export function Blogs() {

    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const navigation = useNavigation();
    useEffect(() => {
        const fetchBlogPosts = async () => {
            try {
                const response = await axios.get('https://da44-2a01-cb0c-9e3-3600-4494-1d7e-b9c4-dc6d.ngrok-free.app/api/blogList', {
                    withCredentials: true,
                });
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
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Personnalisez votre expérience</Text>
            {blogPosts.map((post) => {
                // Replace localhost URL with ngrok URL for the image source
                const imgURL = post.small_photo.replace('localhost:8000', 'da44-2a01-cb0c-9e3-3600-4494-1d7e-b9c4-dc6d.ngrok-free.app');
                return (
                    <TouchableOpacity key={post.id} style={styles.blogCard}
                                      onPress={() => navigation.navigate('BlogPage', { blogId: post.id })}>
                        <Image source={{uri: imgURL}} style={styles.cardImg} />
                        <Text style={styles.blogTitle}>{post.title}</Text>
                        <Text style={styles.blogDate}>
                            {formatDate(post.created_at)}
                        </Text>

                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#221C3E',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    title: {
        color: '#9795B5',
        fontSize: 25,
        width: 320,
        zIndex: 1,
        marginBottom: 30,
        fontWeight: 'bold',
        marginTop: 35,
        textAlign: 'center',
    },
    blogCard: {
        width: '70%',
        height: 400,
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 0, // Set borderWidth to 0 or a smaller value
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 30,
        shadowColor: '#FF4654',
        shadowOpacity: 0.5, // Increase the opacity for a more visible shadow
        shadowRadius: 1, // Adjust the radius to control the blur of the shadow
        elevation: 5,
        shadowOffset: {
            width: 350,
            height: 20,
        },
    },


    blogTitle: {
        fontSize: 18,
        width: '70%',
        color:'#fff',
        justifyContent: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    blogDate: {
        marginBottom: 10,
        color:'#fff',
        textAlign: 'center',
        marginTop: 15,
    },
    cardImg: {
        top: 0,
        zIndex: 0,
        objectFit:'contain',
        position: 'absolute',
        width: 400,
        height: 500,
        borderRadius: 10,
    },
});
