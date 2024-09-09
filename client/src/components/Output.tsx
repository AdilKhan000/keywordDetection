interface OutputComponentProps {
  message: string;
  isSuccess: boolean;
}

const OutputComponent = ({ message, isSuccess }: OutputComponentProps) => {
  return (
    message && (
      <div
        className={`p-3 mt-3 border ${
          isSuccess
            ? "border-success text-success"
            : "border-danger text-danger"
        } rounded`}
      >
        {message}
      </div>
    )
  );
};

export default OutputComponent;
