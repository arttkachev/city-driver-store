// Copyright Epic Games, Inc. All Rights Reserved.
#pragma once
#include "GameFramework/HUD.h"
#include "CityDriverHud.generated.h"


UCLASS(config = Game)
class ACityDriverHud : public AHUD
{
	GENERATED_BODY()

public:
	ACityDriverHud();

	/** Font used to render the vehicle info */
	UPROPERTY()
	UFont* HUDFont;

	// Begin AHUD interface
	virtual void DrawHUD() override;
	// End AHUD interface
};
