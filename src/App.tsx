/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Paper, Typography, Stack, TextField, Button } from '@mui/material';
import './App.css';
import axios from 'axios';

const App = () => {
    const [url, setUrl] = useState<string>('');
    const [isUrlValid, setIsUrlValid] = useState<boolean>(false);
    const [thumbnail, setThumbnail] = useState<string>('');
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/)?([a-zA-Z0-9-_]{11})$/;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setUrl(value);
        // checks if url is valid
        setIsUrlValid(regex.test(value));
    };

    useEffect(() => {
        // returns if url is not valid
        if (!isUrlValid) {
            setThumbnail('');
            return;
        }

        // gets thumbnail of video
        (async () => {
            try {
                const res = await axios.post(`http://localhost:5000/api/thumbnail`, { url });
                setThumbnail(res.data);
            } catch (err) {
                console.log(err);
            }
        })();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const res = await axios.post('http://localhost:5000/api/download', { url }, { responseType: 'blob' });
        const linkUrl = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = linkUrl;
        const title = res.headers['content-disposition'].split('filename=')[1];
        link.setAttribute('download', title);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
    };

    return (
        <div id='App'>
            <Paper className='paper'>
                <form autoComplete='off' onSubmit={handleSubmit}>
                    <Stack spacing={6} direction='column' alignItems='center' className='paperZone'>
                        <Typography variant='h3' component='h4'>
                            <b>
                                <span>Youtube</span> Video Downloader
                            </b>
                        </Typography>
                        <TextField id='input' label='Enter Youtube Video URL' variant='outlined' sx={{ width: '80%' }} value={url} onChange={handleChange} />
                        {thumbnail && <img src={thumbnail} alt='thumbnail' className='thumbnail' />}
                        <Button variant='contained' type='submit' disabled={!isUrlValid} sx={{ width: '40%' }}>
                            Download
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </div>
    );
};

export default App;
