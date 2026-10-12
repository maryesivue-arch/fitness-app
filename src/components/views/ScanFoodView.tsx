'use client';

import React, { useState, useRef, useMemo } from 'react';
import { useFitness } from '@/context/FitnessContext';
import { NIGERIAN_FOOD_DATABASE } from '@/lib/foodDatabase';
import { FoodItem, FoodCategory, MealType } from '@/types';
import { getTodayDateString } from '@/lib/calculator';
import {
  Camera,
  Upload,
  Search,
  Check,
  Sparkles,
  Info,
  X,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function ScanFoodView() {
  const { addMeal, setActiveTab, todayDate } = useFitness();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFood, setSelectedFood] = useState<FoodItem>(NIGERIAN_FOOD_DATABASE[0]); // defaults to Jollof
  const [selectedPortionMultiplier, setSelectedPortionMultiplier] = useState<number>(1.0);
  const [selectedPortionLabel, setSelectedPortionLabel] = useState<string>(
    NIGERIAN_FOOD_DATABASE[0].standardPortionName
  );
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [mealAdded, setMealAdded] = useState(false);

  // Quick preset sample dishes for desktop testing
  const SAMPLE_PRESETS = [
    {
      name: 'Jollof & Chicken',
      url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
      foodId: 'jollof-rice',
    },
    {
      name: 'Egusi Soup & Swallow',
      url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
      foodId: 'egusi-soup',
    },
    {
      name: 'Boiled Egg & Oats',
      url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
      foodId: 'oats-porridge',
    },
    {
      name: 'Grilled Titus Fish',
      url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
      foodId: 'fish-grilled-mackerel',
    },
  ];

  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setMealAdded(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFile(e.target.files[0]);
    }
  };

  // Filtered Nigerian food list
  const filteredFoods = useMemo(() => {
    return NIGERIAN_FOOD_DATABASE.filter((food) => {
      const matchesCategory =
        selectedCategory === 'all' || food.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        food.name.toLowerCase().includes(q) ||
        (food.localName && food.localName.toLowerCase().includes(q)) ||
        food.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSelectedPortionMultiplier(1.0);
    setSelectedPortionLabel(food.standardPortionName);
    setMealAdded(false);
  };

  const calculatedCalories = Math.round(
    selectedFood.baseCalories * selectedPortionMultiplier
  );
  const calculatedProtein = Math.round(
    selectedFood.proteinG * selectedPortionMultiplier
  );
  const calculatedCarbs = Math.round(
    selectedFood.carbsG * selectedPortionMultiplier
  );
  const calculatedFat = Math.round(
    selectedFood.fatG * selectedPortionMultiplier
  );

  const handleAddToFoodLog = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    addMeal({
      date: todayDate,
      time: timeStr,
      mealType,
      foodName: selectedFood.name,
      portion: selectedPortionLabel,
      portionMultiplier: selectedPortionMultiplier,
      calories: calculatedCalories,
      proteinG: calculatedProtein,
      carbsG: calculatedCarbs,
      fatG: calculatedFat,
      photoUrl: imagePreview || undefined,
      notes: selectedFood.localName ? `Local: ${selectedFood.localName}` : undefined,
    });

    setMealAdded(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Scan Food</h2>
        <p className="mt-0.5 text-xs text-gray-400">
          Capture or upload your meal photo, select your portion size, and log authentic Nigerian dishes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Photo Capture & Staging (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Photo Preview / Upload Area */}
          <div className="relative flex min-h-[290px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#202638] bg-[#131622] p-4 text-center">
            {imagePreview ? (
              <div className="relative w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imagePreview}
                  alt="Scanned Food Preview"
                  className="max-h-72 w-full rounded-xl object-cover shadow-lg"
                />

                {/* Viewfinder Overlay Lines */}
                <div className="pointer-events-none absolute inset-2 rounded-lg border border-blue-400/40" />

                {/* Remove Image Button */}
                <button
                  onClick={() => setImagePreview(null)}
                  className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white shadow-md hover:bg-black"
                  aria-label="Remove photo"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="absolute bottom-2 left-2 rounded-lg bg-black/75 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                  Photo Attached
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/15 text-blue-400">
                  <Camera className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Take or Upload Food Photo</p>
                  <p className="text-xs text-gray-400">Snap your plate before eating</p>
                </div>

                {/* Hidden Native Inputs */}
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition-all hover:bg-blue-500"
                  >
                    <Camera className="h-4 w-4" />
                    <span>Take Photo</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-[#202638] bg-[#161a29] px-4 py-2.5 text-xs font-medium text-gray-300 hover:text-white"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload Image</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Demo Presets */}
          <div className="rounded-xl border border-[#202638] bg-[#131622] p-3 text-xs">
            <span className="text-[11px] font-semibold text-gray-400">Quick Plate Presets:</span>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {SAMPLE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setImagePreview(preset.url);
                    const match = NIGERIAN_FOOD_DATABASE.find((f) => f.id === preset.foodId);
                    if (match) handleSelectFood(match);
                  }}
                  className="flex items-center gap-2 rounded-lg border border-[#202638] bg-[#161a29] p-1.5 text-left text-[11px] text-gray-300 hover:border-blue-500 hover:text-white"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="h-8 w-8 rounded-md object-cover"
                  />
                  <span className="truncate font-medium">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Clear AI Vision API Readiness Staging Note (Transparent & Compliant) */}
          <div className="rounded-xl border border-blue-500/20 bg-blue-950/20 p-3.5 text-xs text-blue-300">
            <div className="flex items-start gap-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
              <div>
                <p className="font-semibold text-white">Staged for AI Vision Integration</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-blue-200">
                  Image capture is active and ready for a future vision API endpoint. For this MVP, choose or search your meal below to calculate accurate portion calories.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Searchable Nigerian Food & Portion Selector (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Foods' },
              { id: 'grains', label: 'Grains & Carbs' },
              { id: 'swallow', label: 'Swallows' },
              { id: 'soup', label: 'Soups & Stews' },
              { id: 'protein', label: 'Proteins & Fish' },
              { id: 'breakfast', label: 'Pap & Oats' },
              { id: 'sides', label: 'Sides' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`mr-1.5 whitespace-nowrap rounded-xl px-3 py-2 font-medium transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'border border-[#202638] bg-[#131622] text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Nigerian database (e.g. Amala, Egusi, Titus fish, Plantain...)"
              className="w-full rounded-xl border border-[#202638] bg-[#131622] py-3 pl-10 pr-4 text-xs text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Food Selection Grid */}
          <div className="max-h-56 overflow-y-auto space-y-1.5 rounded-2xl border border-[#202638] bg-[#131622] p-2">
            {filteredFoods.length === 0 ? (
              <p className="p-4 text-center text-xs text-gray-500">
                No matching Nigerian food found. Try searching another name.
              </p>
            ) : (
              filteredFoods.map((food) => {
                const isSelected = selectedFood.id === food.id;
                return (
                  <button
                    key={food.id}
                    onClick={() => handleSelectFood(food)}
                    className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left text-xs transition-all ${
                      isSelected
                        ? 'border border-blue-500 bg-blue-600/20 text-white'
                        : 'border border-transparent bg-[#161a29] text-gray-300 hover:border-gray-700 hover:text-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{food.name}</span>
                        {food.localName && (
                          <span className="rounded bg-[#202638] px-1.5 py-0.5 text-[10px] text-gray-400">
                            {food.localName}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-400">{food.standardPortionName}</p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-blue-400">
                        {food.baseCalories} kcal
                      </span>
                      <p className="text-[10px] text-gray-400">P:{food.proteinG}g C:{food.carbsG}g</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Selected Food Configuration Card */}
          <div className="rounded-2xl border border-[#202638] bg-[#131622] p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#202638] pb-3">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400">
                  Selected Food
                </span>
                <h3 className="text-lg font-bold text-white">{selectedFood.name}</h3>
                {selectedFood.localName && (
                  <p className="text-xs text-gray-400">{selectedFood.localName}</p>
                )}
              </div>

              {/* Total Calculated Calories */}
              <div className="text-right">
                <span className="text-3xl font-black text-white">{calculatedCalories}</span>
                <span className="block text-[11px] font-medium text-blue-400">estimated kcal</span>
              </div>
            </div>

            {/* Lactation & Postpartum Nutrition Benefit Tag */}
            {selectedFood.lactationBenefit && (
              <div className="flex items-start gap-2 rounded-xl bg-blue-600/10 p-3 text-xs text-blue-300">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <p>
                  <strong className="text-white">Lactation Note: </strong>
                  {selectedFood.lactationBenefit}
                </p>
              </div>
            )}

            {/* Portion Selection */}
            <div>
              <label className="text-xs font-semibold text-gray-300">
                Portion Size
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {selectedFood.portions.map((p) => {
                  const isPortionSelected = selectedPortionMultiplier === p.multiplier;
                  return (
                    <button
                      key={p.label}
                      onClick={() => {
                        setSelectedPortionMultiplier(p.multiplier);
                        setSelectedPortionLabel(p.label);
                        setMealAdded(false);
                      }}
                      className={`rounded-xl p-2.5 text-center text-xs transition-all ${
                        isPortionSelected
                          ? 'border border-blue-500 bg-blue-600 text-white shadow-md'
                          : 'border border-[#202638] bg-[#161a29] text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <p className="truncate font-semibold">{p.label.split('(')[0]}</p>
                      <p className="text-[10px] opacity-80">
                        {Math.round(selectedFood.baseCalories * p.multiplier)} kcal
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Meal Time Selector */}
            <div>
              <label className="text-xs font-semibold text-gray-300">
                Log Under
              </label>
              <div className="mt-2 grid grid-cols-4 gap-1.5 text-xs">
                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setMealType(t)}
                    className={`rounded-xl py-2 capitalize font-medium transition-all ${
                      mealType === t
                        ? 'border border-blue-500 bg-blue-600/20 text-blue-400'
                        : 'border border-[#202638] bg-[#161a29] text-gray-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Macros Summary for selected portion */}
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#161a29] p-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-gray-400">Protein</span>
                <p className="font-bold text-emerald-400">{calculatedProtein}g</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400">Carbs</span>
                <p className="font-bold text-blue-400">{calculatedCarbs}g</p>
              </div>
              <div>
                <span className="text-[10px] text-gray-400">Healthy Fats</span>
                <p className="font-bold text-amber-400">{calculatedFat}g</p>
              </div>
            </div>

            {/* Add to Food Log Button */}
            <div className="pt-1">
              {mealAdded ? (
                <div className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span>Logged to {mealType}! ({calculatedCalories} kcal)</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('foodlog')}
                    className="flex items-center gap-1 font-semibold text-emerald-400 hover:underline"
                  >
                    <span>View Food Log</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleAddToFoodLog}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 active:scale-95"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  <span>Add to Food Log (+{calculatedCalories} kcal)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
