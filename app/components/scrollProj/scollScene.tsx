import Link from "next/link";


const Scene: React.FC = () => {
    return (
        <div className="home" >
            <div className="link">
                <span>&#8594;</span>
                <Link href="/components/scrollProj/projects/" >All Stages</Link>
            </div>
        </div>
    );
}
export default Scene;