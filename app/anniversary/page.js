import websiteBackground from "../../assets/website_background.png";

export default function AnniversaryPage() {
  return (
    <main
      className="anniversary-page"
      style={{ backgroundImage: `url(${websiteBackground.src})` }}
    />
  );
}
