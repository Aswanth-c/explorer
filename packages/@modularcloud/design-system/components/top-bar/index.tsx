import { CardOff } from "../../icons";

export function TopBar() {
    return <div className="h-12 bg-specialty-gray py-2 px-6 flex flex-row xs:justify-between gap-16 border-b border-mid-dark/5 shadow-[inset_0px_1px_7px_rgba(42,43,46,0.06)]">
        <div>Celestia</div>
        <div className="flex flex-row gap-2 items-center truncate">
            <span className="flex flex-row gap-2 items-center">
                <CardOff />
                <p className="font-semibold">Block</p>
            </span>
            <span className="text-gray">/</span>
            <p className="truncate">0xE9A41C60FA1DCBA5B9CE560325FDB6F456464</p>
        </div>
    </div>
}