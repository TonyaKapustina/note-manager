import {useDirectories} from "@/api/useDirectories";

export default function MyApp() {
    const {data, isLoading} = useDirectories();

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex grow">
            <a href={`${data[0].id}`}>Open directories</a>
        </div>
    )
}