import Navigation from "./Navigation";
import StreamController from "@/components/StreamController";
const Header = () => {
	return (
		<header className="sticky top-0 z-200 bg-green-500 h-10 flex justify-between">
			<StreamController />
			<Navigation />
		</header>
	);
};

export default Header;
