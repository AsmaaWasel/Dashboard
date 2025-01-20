import ModernChartsDashboard from "@/components/charts/Charts";

const Chart = () => {
  return (
    <div className="p-4 !pt-2 sm:p-6 md:p-8 min-h-screen">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800 dark:text-gray-100">
        Analytics Dashboard
      </h2>
      <ModernChartsDashboard />
    </div>
  );
};

export default Chart;
