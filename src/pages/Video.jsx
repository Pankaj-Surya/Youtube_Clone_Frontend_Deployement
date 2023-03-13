import React, { Children, useEffect, useState } from "react";
import styled from "styled-components";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOffAltOutlinedIcon from "@mui/icons-material/ThumbDownOffAltOutlined";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";
import Comments from "../components/Comments";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { dislike, fetchSuccess, like } from "../redux/videoSlice"
import { format } from "timeago.js";
import { subscription } from "../redux/userSlice";
import Recommendation from "../components/Recommendation";
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  EmailIcon,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  PinterestIcon,
  PinterestShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share"
import HoverVideoPlayer from 'react-hover-video-player';




const Container = styled.div`
  display: flex;
  gap: 24px;
`;

const Content = styled.div`
  flex: 5;
`;
const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 18px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;


const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const ChannelDetail = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
  font-size: 12px;
`;

const Description = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Pane = styled.div`
   padding: "8px 10px";
  background-color : "#fafafa";
  border-radius: "3px";
  border: "1px solid #dddddd";
  display: "flex";
  justify-content: "space-between";
  position: "relative";
  font-family: "sans-serif";
  font-size: "16px"
`
const ToolTip = styled.div`
  border-color: "#111111";
  color: "#ffffff";
  position: "absolute";
  top: "-25px";
  right: "-10px";
  font-weight: 600;
  font-size: "12px";
  padding: "4px 5px";

  &:after {
    content: "''";
    position: "absolute";
    width: "0";
    height: "0";
    border: "5px solid transparent";
    border: "#111111";
    bottom: "-10px";
    left: "50%";
    transform: "translateX(-50%)"
  }
`

const ShareContainer = styled.div`
   display: flex;
   flex-direction: column;
`
const ShareIconContainer = styled.div`
   display: flex;
`

const CopyContainer = styled.div`
  width: "320px";
  margin: "100px auto";
  display: flex;
  margin-top: 3rem;
`


const InputCopy = styled.input`
  margin-right: 10px;
`


const Video = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video)
  const [isSubUser, setIsSubUser] = useState(false)
  const [channel, setChannel] = useState({})
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState([])
  const path = useLocation().pathname.split('/')[2]
  const [open, setOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const url = process.env.REACT_APP_COPIED_URL+useLocation().pathname

  console.log(url)
  useEffect(() => {
    const fetchData = async () => {
      const vidRes = await axios.get(`${process.env.REACT_APP_API_URL}/videos/find/${path}`)
      const channelRes = await axios.get(`${process.env.REACT_APP_API_URL}/users/find/${vidRes.data.userId}`)
      //console.log("vid res",vidRes.data)
      //console.log("channel res ",channelRes.data)
      setChannel(channelRes.data)

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/${path}`)
      //console.log(res.data)
      setComment(res.data)

      //console.log(comment)
      if (currentUser) {
        await axios.put(`${process.env.REACT_APP_API_URL}/videos/view/${path}`);
        //console.log("Views Increased!")
      }
      dispatch(fetchSuccess(vidRes.data))
    }
    fetchData()
  }, [path, dispatch])

  const handleLike = async () => {
    const token = localStorage.getItem("access_token")
    if (currentUser) {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/like/${currentVideo._id}`, { token: token })
      dispatch(like(currentUser._id))
    } else {
      alert("Please Login first")
      return navigate("/signin")
    }
  }

  const handleDislike = async () => {
    const token = localStorage.getItem("access_token")
    if (currentUser) {
      await axios.put(`${process.env.REACT_APP_API_URL}/users/dislike/${currentVideo._id}`, { token: token });
      dispatch(dislike(currentUser._id));
    } else {
      alert("Please Login first")
      navigate("/signin")
    }

  };


  const handleSub = async () => {
    const token = localStorage.getItem("access_token");
    if (currentUser) {
      currentUser?.others?.subscribedUsers.includes(channel._id)
        ? await axios.put(`${process.env.REACT_APP_API_URL}/users/unsub/${channel._id}`, { token: token })
        : await axios.put(`${process.env.REACT_APP_API_URL}/users/sub/${channel._id}`, { token: token });
      dispatch(subscription(channel._id));
    } else {
      alert("Please Login First")
      navigate("/signin")
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  //console.log(currentUser)
  //console.log(path)
  return (
    <>
      <Container>
        <Content>
          <VideoWrapper>
            <VideoFrame src={currentVideo?.videoUrl} controls playing={true} />
            </VideoWrapper>
          <Title>{currentVideo?.title}</Title>
          <Details>
            <Info>  {currentVideo?.views} views • {format(currentVideo?.createdAt)}</Info>
            <Buttons>
              <Button onClick={handleLike}>
                {
                  currentVideo?.likes?.includes(currentUser?._id) ?
                    (<ThumbUpIcon />) :
                    (<ThumbUpOutlinedIcon />)
                }
                {currentVideo?.likes?.length}
              </Button>
              <Button onClick={handleDislike}>
                {currentVideo?.dislikes?.includes(currentUser?._id) ? (
                  <ThumbDownIcon />
                ) : (
                  <ThumbDownOffAltOutlinedIcon />
                )}{" "}
                Dislike
              </Button>
              <Button onClick={handleClickOpen}>
                <ReplyOutlinedIcon /> Share
              </Button>
              <Button>
                <AddTaskOutlinedIcon /> Save
              </Button>
            </Buttons>
          </Details>
          <Hr />
          <Channel>
            <ChannelInfo>
              <Image src={channel.img} />
              <ChannelDetail>
                <ChannelName>{channel.name}</ChannelName>
                <ChannelCounter>{channel.subscribers} subscribers</ChannelCounter>
                <Description>
                  {currentVideo?.desc}.
                </Description>
              </ChannelDetail>
            </ChannelInfo>
            {/* logged in user == currvid user =>then  dont show sub button */}
            {
              currentUser?.others?._id === currentVideo?.userId
                ? <Subscribe>My Channel</Subscribe>
                : <Subscribe onClick={handleSub}>
                  {currentUser?.others?.subscribedUsers?.includes(channel._id)
                    ? "SUBSCRIBED"
                    : "SUBSCRIBE"}
                </Subscribe>
            }
          </Channel>
          <Hr />
          <Comments videoId={currentVideo?._id} comment={comment} />
        </Content>
        <Recommendation tags={currentVideo?.tags} />
      </Container>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sharing options"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ display: "flex", justifyContent: "space-between" }} id="alert-dialog-description">
            <ShareContainer>
              <ShareIconContainer>
                <FacebookShareButton
                  url={'https://www.example.com'}
                  quote={'Dummy text!'}
                  hashtag="#muo"
                >
                  <FacebookIcon size={50} round />
                </FacebookShareButton>
                <TwitterShareButton
                  url={'https://www.example.com'}
                  quote={'Dummy text!'}
                  hashtag="#muo"
                >
                  <TwitterIcon size={50} round />
                </TwitterShareButton>
                <LinkedinShareButton
                  title={"Pankaj Youtube Clone Videos"}
                  summary={"Pankaj Developed Youtube Clone"}
                  source={`${url}`}
                  url={"https://www.example.com"}
                >
                  <LinkedinIcon size={50} round />
                </LinkedinShareButton>
                <TelegramShareButton
                  url={url}
                  title={"Pankaj Youtube Clone"}
                >
                  <TelegramIcon size={50} round />
                </TelegramShareButton>
                <PinterestShareButton
                  url={'https://www.example.com'}
                  media={'https://www.example.com'}
                  description={"Pankaj Developed Youtube Clone video"}   >
                  <PinterestIcon size={50} round />
                </PinterestShareButton>
                <WhatsappShareButton
                  url={'https://www.example.com'}
                  title={"Pankaj Youtube Clone Videos"}
                  separator={url}>
                  <WhatsappIcon size={50} round />
                </WhatsappShareButton>
              </ShareIconContainer>
              <CopyContainer>
                <InputCopy
                  type="text"
                  readOnly
                  value={url}
                  placeholder="Type some text here"
                  onChange={()=>{

                  }}
                />
                <CopyToClipboard text={url} onCopy={onCopyText}>
                  <div className="copy-area">
                    <button>Copy to Clipboard</button>
                    <span className={`copy-feedback ${isCopied ? "active" : ""}`}>
                      Copied!
                    </span>
                  </div>
                </CopyToClipboard>

              </CopyContainer>
            </ShareContainer>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Video;
