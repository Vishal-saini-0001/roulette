import React from "react";
import { FcEngineering } from "react-icons/fc";

const PageNotFind = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen flex-col ">
      <div className="animate-spin text-4xl">
        <FcEngineering />
      </div>
      <div className="text-cyan-500 text-5xl animate-bounce">
        Error 404! Page not find
      </div>
    </div>
  );
};

export default PageNotFind;
