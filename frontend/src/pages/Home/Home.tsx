import '../../scss/App.scss';

import Header from '../../components/Header/Header.tsx';
import Footer from '../../components/Footer/Footer.tsx';
import DoubleImage from "../../components/DoubleImage/DoubleImage.tsx";
import SingleImage from "../../components/SingleImage/SingleImage.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import TitleDescButtonsSection from "../../components/TitleDescButtonsSection/TitleDescButtonsSection.tsx";
import Title from "../../components/Title/Title.tsx";
import Newsletter from "../../components/Newsletter/Newsletter.tsx";
import ImageRightContetnLeft from "../../components/ImageRightContetLeft/ImageRightContetLeft.tsx";
import Sponsors from "../../components/Sponsors/Sponsors.tsx";

function Home() {
    return (
        <div className="App">
            <Header />
            <TitleDescButtonsSection />
            <DoubleImage />
            <Title title="A dedicated team to grow your company" />
            <SingleImage />
            <Sponsors />
            <ImageRightContetnLeft />
            <Newsletter />
            <Footer />
        </div>
    );
}

export default Home;
