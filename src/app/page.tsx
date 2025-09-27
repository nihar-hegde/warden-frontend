import { WeatherPropertyFilter } from "@/components/weather-property-filter";

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <WeatherPropertyFilter />
      </div>
    </main>
  );
}
