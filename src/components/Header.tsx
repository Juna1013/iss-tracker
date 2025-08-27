import ISSIcon from "./ISSIcon";

export default function Header() {
  return (
    <header className="mb-8 text-center">
      <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg">
        <ISSIcon className="h-10 w-10 text-white" />
      </div>
      <h1 className="mb-2 text-4xl font-bold text-gray-900">
        ISS Tracker
      </h1>
      <p className="text-lg text-gray-600">
        国際宇宙ステーションの現在位置をリアルタイムで可視化
      </p>
    </header>
  );
}
