import '../../scss/App.scss';
import React from "react";
import Header from '../../components/Header/Header';
import Futter from '../../components/Futter/Futter';
import DoubleImage from "../../components/DoubleImage/DoubleImage";
import SingleImage from "../../components/SingleImage/SingleImage";
import 'bootstrap/dist/css/bootstrap.min.css';
import TitleDescButtonsSection from "../../components/TitleDescButtonsSection/TitleDescButtonsSection";
import Title from "../../components/Title/Title";
import Newsletter from "../../components/Newsletter/Newsletter";
import ImageRightContetnLeft from "../../components/ImageRightContetLeft/ImageRightContetLeft";
function Home() {
    return (
        <div className="App">
            <Header/>
            <TitleDescButtonsSection />
            <DoubleImage/>
            <Title title="A dedicated team to grow your company" />
            <SingleImage/>
            <ImageRightContetnLeft/>
            <Newsletter/>
            <Futter/>
        </div>
    );
    }
export default Home;
