import wip from "/public/work-in-progress.png";

const UnderConstruction = () => {
  return (
    <div className="flex items-center justify-center">
      <img
        src={wip}
        alt="Company Logo"
        width={200}
        height={200}
        className="mb-5"
      />
    </div>
  );
};

export default UnderConstruction;
