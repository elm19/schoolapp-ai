
type Props = { count: number };

export const ParticipantsCounter = ({ count }: Props) => {
  return (
    <div className="flex text-center items-center gap-2">
      <span className="text-xs text-muted-foreground mt-1">
        Participants {count}
      </span>
    </div>
  );
};
