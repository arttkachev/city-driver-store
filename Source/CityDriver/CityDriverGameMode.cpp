// Copyright Epic Games, Inc. All Rights Reserved.

#include "CityDriverGameMode.h"
#include "CityDriverPawn.h"
#include "CityDriverHud.h"

ACityDriverGameMode::ACityDriverGameMode()
{
	DefaultPawnClass = ACityDriverPawn::StaticClass();
	HUDClass = ACityDriverHud::StaticClass();
}
