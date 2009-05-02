use lib "$ENV{HOME}/Workspace/EclipseWorkspace/module-build-jsan/lib";

use Module::Build::JSAN;

my $build = Module::Build::JSAN->new(

	module_name    => 'Test.Run',
	create_makefile_pl => 'passthrough',
	dist_version   => 0.01,
	dist_author   => 'SamuraiJack',
	dist_abstract  => 'Yet another JavaScript testing platform, running on Joose3 + bridge to ExtJS',
	license        => 'perl',
	
	components => [
	   'Test.Run.Result',
	   'Test.Run.Result.Diagnostic',
	   'Test.Run.Result.Assertion',
	   
	   'Test.Run.Test',
	   'Test.Run.Test.Browser',
	   'Test.Run.Test.Browser.ExtJS',
	   
	   'Test.Run.Harness.Browser.UI.Viewport',
	   'Test.Run.Harness.Browser.UI.TestGrid',
	   'Test.Run.Harness.Browser.UI.AssertionGrid',
	   
	   'Test.Run.Harness',
	   'Test.Run.Harness.Browser',
	   'Test.Run.Harness.Browser.Single',
	   'Test.Run.Harness.Browser.Multi',
	   'Test.Run.Harness.Browser.Proven',
	   
	   'Test.Run'
	]
);

$build->create_build_script;

