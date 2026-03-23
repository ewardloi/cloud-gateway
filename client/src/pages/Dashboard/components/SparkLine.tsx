import { Sparkline } from "@mantine/charts";

type SparkLineProps = {
  data: number[];
  color?: string;
  height?: number | string;
  width?: number | string;
};

export function SparkLine({
  data,
  color = "#228be6",
  height = 40,
  width = "100%",
}: SparkLineProps) {
  return (
    <Sparkline
      h={height}
      w={width}
      data={data}
      curveType="monotone"
      color={color}
      fillOpacity={0.6}
      strokeWidth={2}
    />
  );
}
