---
name: ck:mobile-development
description: Build mobile apps with React Native, Flutter, Swift/SwiftUI, Kotlin/Jetpack Compose. Use for iOS/Android, mobile UX, performance optimization, offline-first, app store deployment.
license: MIT
version: 1.0.0
argument-hint: "[platform] [feature]"
---

# Mobile Development Skill

Production-ready mobile development with modern frameworks, best practices, and mobile-first thinking patterns.

## When to Use

- Building mobile applications (iOS, Android, or cross-platform)
- Implementing mobile-first design and UX patterns
- Optimizing for mobile constraints (battery, memory, network, small screens)
- Making native vs cross-platform technology decisions
- Implementing offline-first architecture and data sync
- Following platform-specific guidelines (iOS HIG, Material Design)
- Optimizing mobile app performance and user experience
- Implementing mobile security and authentication
- Testing mobile applications (unit, integration, E2E)
- Deploying to App Store and Google Play

## Technology Selection Guide

**Cross-Platform Frameworks:**
- **React Native**: JavaScript expertise, web code sharing, mature ecosystem (121K stars, 67% familiarity)
- **Flutter**: Performance-critical apps, complex animations, fastest-growing (170K stars, 46% adoption)

**Native Development:**
- **iOS (Swift/SwiftUI)**: Maximum iOS performance, latest features, Apple ecosystem integration
- **Android (Kotlin/Jetpack Compose)**: Maximum Android performance, Material Design 3, platform optimization

See: `references/mobile-frameworks.md` for detailed framework comparisons

## Mobile Development Mindset

**The 10 Commandments of Mobile Development:**

1. **Performance is Foundation, Not Feature** - 70% abandon apps >3s load time
2. **Every Kilobyte, Every Millisecond Matters** - Mobile constraints are real
3. **Offline-First by Default** - Network is unreliable, design for it
4. **User Context > Developer Environment** - Think real-world usage scenarios
5. **Platform Awareness Without Platform Lock-In** - Respect platform conventions
6. **Iterate, Don't Perfect** - Ship, measure, improve cycle is survival
7. **Security and Accessibility by Design** - Not afterthoughts
8. **Test on Real Devices** - Simulators lie about performance
9. **Architecture Scales with Complexity** - Don't over-engineer simple apps
10. **Continuous Learning is Survival** - Mobile landscape evolves rapidly

See: `references/mobile-mindset.md` for thinking patterns and decision frameworks

## Reference Navigation

**Core Technologies:**
- `mobile-frameworks.md` - React Native, Flutter, Swift, Kotlin, framework comparison matrices, when to use each
- `mobile-ios.md` - Swift 6, SwiftUI, iOS architecture patterns, HIG, App Store requirements, platform capabilities
- `mobile-android.md` - Kotlin, Jetpack Compose, Material Design 3, Play Store, Android-specific features

**Best Practices & Development Mindset:**
- `mobile-best-practices.md` - Mobile-first design, performance optimization, offline-first architecture, security, testing, accessibility, deployment, analytics
- `mobile-debugging.md` - Debugging tools, performance profiling, crash analysis, network debugging, platform-specific debugging
- `mobile-mindset.md` - Thinking patterns, decision frameworks, platform-specific thinking, common pitfalls, debugging strategies

## Key Best Practices (2024-2025)

**Performance Targets:**
- App launch: <2 seconds (70% abandon if >3s)
- Memory usage: <100MB for typical screens
- Network requests: Batch and cache aggressively
- Battery impact: Respect Doze Mode and background restrictions
- Animation: 60 FPS (16.67ms per frame)

**Architecture:**
- MVVM for small-medium apps (clean separation, testable)
- MVVM + Clean Architecture for large enterprise apps
- Offline-first with hybrid sync (push + pull)
- State management: Zustand (React Native), Riverpod 3 (Flutter), StateFlow (Android)

**Security (OWASP Mobile Top 10):**
- OAuth 2.0 + JWT + Biometrics for authentication
- Keychain (iOS) / KeyStore (Android) for sensitive data
- Certificate pinning for network security
- Never hardcode credentials or API keys
- Implement proper session management

**Testing Strategy:**
- Unit tests: 70%+ coverage for business logic
- Integration tests: Critical user flows
- E2E tests: Detox (React Native), Appium (cross-platform), XCUITest (iOS), Espresso (Android)
- Real device testing mandatory before release

**Deployment:**
- Fastlane for automation across platforms
- Staged rollouts: Internal → Closed → Open → Production
- Mandatory: iOS 17 SDK (2024), Android 15 API 35 (Aug 2025)
- CI/CD saves 20% development time

## Quick Decision Matrix

| Need | Choose |
|------|--------|
| JavaScript team, web code sharing | React Native |
| Performance-critical, complex animations | Flutter |
| Maximum iOS performance, latest features | Swift/SwiftUI native |
| Maximum Android performance, Material 3 | Kotlin/Compose native |
| Rapid prototyping | React Native + Expo |
| Desktop + mobile | Flutter |
| Enterprise with JavaScript skills | React Native |
| Startup with limited resources | Flutter or React Native |
| Gaming or heavy graphics | Native (Swift/Kotlin) or Unity |

## Framework Quick Comparison (2024-2025)

| Criterion | React Native | Flutter | Swift/SwiftUI | Kotlin/Compose |
|-----------|--------------|---------|---------------|----------------|
| **Stars** | 121K | 170K | N/A | N/A |
| **Adoption** | 35% | 46% | iOS only | Android only |
| **Performance** | 80-90% native | 85-95% native | 100% native | 100% native |
| **Dev Speed** | Fast (hot reload) | Very fast (hot reload) | Fast (Xcode Previews) | Fast (Live Edit) |
| **Learning Curve** | Easy (JavaScript) | Medium (Dart) | Medium (Swift) | Medium (Kotlin) |
| **UI Paradigm** | Component-based | Widget-based | Declarative | Declarative |
| **Community** | Huge (npm) | Growing | Apple ecosystem | Android ecosystem |
| **Best For** | JS teams, web sharing | Performance, animations | iOS-only apps | Android-only apps |

## Implementation Checklist

**Project Setup:**
- Choose framework → Initialize project → Configure dev environment → Setup version control → Configure CI/CD → Team standards

**Architecture:**
- Choose pattern (MVVM/Clean) → Setup folders → State management → Navigation → API layer → Error handling → Logging

**Core Features:**
- Authentication → Data persistence → API integration → Offline sync → Push notifications → Deep linking → Analytics

**UI/UX:**
- Design system → Platform guidelines → Accessibility → Responsive layouts → Dark mode → Localization → Animations

**Performance:**
- Image optimization → Lazy loading → Memory profiling → Network optimization → Battery testing → Launch time optimization

**Quality:**
- Unit tests (70%+) → Integration tests → E2E tests → Accessibility testing → Performance testing → Security audit

**Security:**
- Secure storage → Authentication flow → Network security → Input validation → Session management → Encryption

**Deployment:**
- App icons/splash → Screenshots → Store listings → Privacy policy → TestFlight/Internal testing → Staged rollout → Monitoring

## Platform-Specific Guidelines

**iOS (Human Interface Guidelines):**
- Native navigation patterns (tab bar, navigation bar)
- iOS design patterns (pull to refresh, swipe actions)
- San Francisco font, iOS color system
- Haptic feedback, 3D Touch/Haptic Touch
- Respect safe areas and notch

**Android (Material Design 3):**
- Material navigation (bottom nav, navigation drawer)
- Floating action buttons, material components
- Roboto font, Material You dynamic colors
- Touch feedback (ripple effects)
- Respect system bars and gestures

## Common Pitfalls to Avoid

1. **Testing only on simulators** - Real devices show true performance
2. **Ignoring platform conventions** - Users expect platform-specific patterns
3. **No offline handling** - Network failures will happen
4. **Poor memory management** - Leads to crashes and poor UX
5. **Hardcoded credentials** - Security vulnerability
6. **No accessibility** - Excludes 15%+ of users
7. **Premature optimization** - Optimize based on metrics, not assumptions
8. **Over-engineering** - Start simple, scale as needed
9. **Skipping real device testing** - Simulators don't show battery/network issues
10. **Not respecting battery** - Background processing must be justified

## Performance Budgets

**Recommended Targets:**
- **App size**: <50MB initial download, <200MB total
- **Launch time**: <2 seconds to interactive
- **Screen load**: <1 second for cached data
- **Network request**: <3 seconds for API calls
- **Memory**: <100MB for typical screens, <200MB peak
- **Battery**: <5% drain per hour of active use
- **Frame rate**: 60 FPS (16.67ms per frame)

## Resources

**Official Documentation:**
- React Native: https://reactnative.dev/
- Flutter: https://flutter.dev/
- iOS HIG: https://developer.apple.com/design/human-interface-guidelines/
- Material Design: https://m3.material.io/
- OWASP Mobile: https://owasp.org/www-project-mobile-top-10/

**Tools & Testing:**
- Detox E2E: https://wix.github.io/Detox/
- Appium: https://appium.io/
- Fastlane: https://fastlane.tools/
- Firebase: https://firebase.google.com/

**Community:**
- React Native Directory: https://reactnative.directory/
- Pub.dev (Flutter packages): https://pub.dev/
- Awesome React Native: https://github.com/jondot/awesome-react-native
- Awesome Flutter: https://github.com/Solido/awesome-flutter


---

## Reference Workflows

> The following sections are inlined from the skill's reference files for Cursor compatibility.

### mobile android

# Android Native Development

Complete guide to Android development with Kotlin and Jetpack Compose (2024-2025).

## Kotlin 2.1 Overview

### Key Features
- **Null safety**: No more NullPointerExceptions
- **Coroutines**: Structured concurrency
- **Extension functions**: Extend classes without inheritance
- **Sealed classes**: Type-safe state management
- **Data classes**: Automatic equals/hashCode/toString

### Modern Kotlin Patterns

**Coroutines:**
```kotlin
// Suspend function
suspend fun fetchUser(id: String): User {
    return withContext(Dispatchers.IO) {
        api.getUser(id)
    }
}

// Usage in ViewModel
viewModelScope.launch {
    try {
        val user = fetchUser("123")
        _uiState.update { it.copy(user = user) }
    } catch (e: Exception) {
        _uiState.update { it.copy(error = e.message) }
    }
}
```

**Flow (Reactive streams):**
```kotlin
class UserRepository {
    fun observeUsers(): Flow<List<User>> = flow {
        while (true) {
            emit(database.getUsers())
            delay(5000)  // Poll every 5 seconds
        }
    }.flowOn(Dispatchers.IO)
}

// Collect in ViewModel
init {
    viewModelScope.launch {
        repository.observeUsers().collect { users ->
            _uiState.update { it.copy(users = users) }
        }
    }
}
```

**Sealed classes (Type-safe states):**
```kotlin
sealed class UiState {
    object Loading : UiState()
    data class Success(val data: List<User>) : UiState()
    data class Error(val message: String) : UiState()
}

// Pattern matching
when (uiState) {
    is UiState.Loading -> ShowLoader()
    is UiState.Success -> ShowData(uiState.data)
    is UiState.Error -> ShowError(uiState.message)
}
```

## Jetpack Compose

### Why Compose?
- **Declarative**: Describe UI state, not imperative commands
- **60% adoption**: In top 1,000 apps (2024)
- **Less code**: 40% reduction vs Views
- **Modern**: Built for Kotlin and coroutines
- **Material 3**: First-class support

### Compose Basics

```kotlin
@Composable
fun UserListScreen(viewModel: UserViewModel = viewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    Column(modifier = Modifier.fillMaxSize()) {
        when (val state = uiState) {
            is UiState.Loading -> {
                CircularProgressIndicator(
                    modifier = Modifier.align(Alignment.CenterHorizontally)
                )
            }
            is UiState.Success -> {
                LazyColumn {
                    items(state.data) { user ->
                        UserItem(user)
                    }
                }
            }
            is UiState.Error -> {
                Text(
                    text = state.message,
                    color = MaterialTheme.colorScheme.error
                )
            }
        }
    }
}

@Composable
fun UserItem(user: User) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        Text(
            text = user.name,
            style = MaterialTheme.typography.bodyLarge
        )
    }
}
```

**Key Composables:**
- `Column/Row/Box`: Layout
- `LazyColumn/LazyRow`: Recycler equivalent (virtualized)
- `Text/Image/Icon`: Content
- `Button/TextField`: Input
- `Card/Surface`: Containers

## Architecture Patterns

### MVVM with Clean Architecture

```kotlin
// Domain Layer - Use Case
class GetUsersUseCase @Inject constructor(
    private val repository: UserRepository
) {
    operator fun invoke(): Flow<Result<List<User>>> =
        repository.getUsers()
}

// Data Layer - Repository
interface UserRepository {
    fun getUsers(): Flow<Result<List<User>>>
}

class UserRepositoryImpl @Inject constructor(
    private val api: UserApi,
    private val dao: UserDao
) : UserRepository {
    override fun getUsers(): Flow<Result<List<User>>> = flow {
        // Local cache first
        val cachedUsers = dao.getUsers()
        emit(Result.success(cachedUsers))

        // Then fetch from network
        try {
            val networkUsers = api.getUsers()
            dao.insertUsers(networkUsers)
            emit(Result.success(networkUsers))
        } catch (e: Exception) {
            emit(Result.failure(e))
        }
    }.flowOn(Dispatchers.IO)
}

// Presentation Layer - ViewModel
@HiltViewModel
class UserViewModel @Inject constructor(
    private val getUsersUseCase: GetUsersUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserUiState())
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    init {
        loadUsers()
    }

    private fun loadUsers() {
        viewModelScope.launch {
            getUsersUseCase().collect { result ->
                result.onSuccess { users ->
                    _uiState.update { it.copy(users = users, isLoading = false) }
                }.onFailure { error ->
                    _uiState.update { it.copy(error = error.message, isLoading = false) }
                }
            }
        }
    }
}

// UI State
data class UserUiState(
    val users: List<User> = emptyList(),
    val isLoading: Boolean = true,
    val error: String? = null
)
```

### MVI (Model-View-Intent)

**When to use:**
- Unidirectional data flow needed
- Complex state management
- Time-travel debugging
- Predictable state updates

```kotlin
// State
data class UserScreenState(
    val users: List<User> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null
)

// Events (User intentions)
sealed class UserEvent {
    object LoadUsers : UserEvent()
    data class DeleteUser(val id: String) : UserEvent()
    object RetryLoad : UserEvent()
}

// ViewModel
class UserViewModel : ViewModel() {
    private val _state = MutableStateFlow(UserScreenState())
    val state: StateFlow<UserScreenState> = _state.asStateFlow()

    fun onEvent(event: UserEvent) {
        when (event) {
            is UserEvent.LoadUsers -> loadUsers()
            is UserEvent.DeleteUser -> deleteUser(event.id)
            is UserEvent.RetryLoad -> loadUsers()
        }
    }
}
```

## Dependency Injection

### Hilt (Recommended for Large Apps)

**Setup:**
```kotlin
// App class
@HiltAndroidApp
class MyApplication : Application()

// Activity
@AndroidEntryPoint
class MainActivity : ComponentActivity()

// ViewModel
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository,
    private val analytics: Analytics
) : ViewModel()

// Module
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    @Provides
    @Singleton
    fun provideUserApi(retrofit: Retrofit): UserApi =
        retrofit.create(UserApi::class.java)
}
```

### Koin (Lightweight Alternative)

**Setup:**
```kotlin
// Module definition
val appModule = module {
    single { UserRepository(get()) }
    viewModel { UserViewModel(get()) }
}

// Application
class MyApp : Application() {
    override fun onCreate() {
        super.onCreate()
        startKoin {
            androidContext(this@MyApp)
            modules(appModule)
        }
    }
}

// Usage
class UserViewModel(
    private val repository: UserRepository
) : ViewModel()
```

**Hilt vs Koin:**
- **Hilt**: Compile-time, type-safe, Google-backed, complex setup
- **Koin**: Runtime, simple DSL, 50% faster setup, reflection-based

## Performance Optimization

### R8 Optimization

**Automatic optimizations:**
- Code shrinking (remove unused)
- Obfuscation (rename classes/methods)
- Optimization (method inlining)

```groovy
// build.gradle
android {
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt')
        }
    }
}
```

**Impact:**
- 10-20% app size reduction
- 20% faster startup
- Harder to reverse engineer

### Baseline Profiles

**Performance boost:**
- 10-20% faster startup
- Reduced jank in critical paths
- AOT compilation of hot code

```gradle
// build.gradle
dependencies {
    implementation "androidx.profileinstaller:profileinstaller:1.3.1"
}
```

### Compose Performance

**1. Stability annotations:**
```kotlin
// Mark stable classes
@Stable
data class User(val name: String, val age: Int)

// Immutable collections
@Immutable
data class UserList(val users: List<User>)
```

**2. Avoid recomposition:**
```kotlin
// ❌ Bad: Recomposes every render
@Composable
fun UserList(users: List<User>) {
    LazyColumn {
        items(users) { user ->
            Text(user.name)  // Recreated every time
        }
    }
}

// ✅ Good: Use keys
@Composable
fun UserList(users: List<User>) {
    LazyColumn {
        items(users, key = { it.id }) { user ->
            Text(user.name)
        }
    }
}
```

**3. Remember expensive computations:**
```kotlin
@Composable
fun ExpensiveList(items: List<Item>) {
    val sortedItems = remember(items) {
        items.sortedBy { it.priority }
    }

    LazyColumn {
        items(sortedItems) { item ->
            ItemCard(item)
        }
    }
}
```

## Testing

### Unit Testing (JUnit + MockK)

```kotlin
class UserViewModelTest {
    private lateinit var viewModel: UserViewModel
    private val mockRepository = mockk<UserRepository>()

    @Before
    fun setup() {
        viewModel = UserViewModel(mockRepository)
    }

    @Test
    fun `loadUsers should update state with users`() = runTest {
        // Given
        val users = listOf(User("1", "Test", "test@example.com"))
        coEvery { mockRepository.getUsers() } returns flowOf(Result.success(users))

        // When
        viewModel.loadUsers()

        // Then
        val state = viewModel.uiState.value
        assertEquals(users, state.users)
        assertFalse(state.isLoading)
    }
}
```

### Compose Testing

```kotlin
class UserListScreenTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun displayUsers() {
        val users = listOf(User("1", "John", "john@example.com"))

        composeTestRule.setContent {
            UserListScreen(
                users = users,
                onUserClick = {}
            )
        }

        composeTestRule.onNodeWithText("John").assertIsDisplayed()
    }
}
```

### Instrumented Testing (Espresso)

```kotlin
@RunWith(AndroidJUnit4::class)
class LoginActivityTest {
    @get:Rule
    val activityRule = ActivityScenarioRule(LoginActivity::class.java)

    @Test
    fun loginFlow() {
        onView(withId(R.id.emailField))
            .perform(typeText("test@example.com"))

        onView(withId(R.id.passwordField))
            .perform(typeText("password123"))

        onView(withId(R.id.loginButton))
            .perform(click())

        onView(withText("Welcome"))
            .check(matches(isDisplayed()))
    }
}
```

## Material Design 3

### Theme Setup

```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
```

### Material Components

```kotlin
// Cards
Card(
    modifier = Modifier.fillMaxWidth(),
    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
) {
    Text("Content")
}

// FAB
FloatingActionButton(onClick = { /* Do something */ }) {
    Icon(Icons.Default.Add, contentDescription = "Add")
}

// Navigation
NavigationBar {
    items.forEach { item ->
        NavigationBarItem(
            icon = { Icon(item.icon, contentDescription = null) },
            label = { Text(item.label) },
            selected = selectedItem == item,
            onClick = { selectedItem = item }
        )
    }
}
```

## Google Play Requirements (2024-2025)

### SDK Requirements
- **Current**: Target Android 14 (API 34)
- **Mandatory (Aug 31, 2025)**: Target Android 15 (API 35)

### Privacy & Security
- **Privacy policy**: Required for apps collecting data
- **Data safety**: Form in Play Console
- **Permissions**: Request only needed, justify dangerous permissions
- **Encryption**: HTTPS for network, KeyStore for sensitive data

### AAB (Android App Bundle)
```gradle
android {
    bundle {
        density {
            enableSplit true
        }
        abi {
            enableSplit true
        }
        language {
            enableSplit true
        }
    }
}
```

**Benefits:**
- 15-30% smaller downloads
- Dynamic feature modules
- Instant apps support

## Common Pitfalls

1. **Main thread blocking**: Use coroutines with Dispatchers.IO
2. **Memory leaks**: Unregister listeners, cancel coroutines
3. **Configuration changes**: Use ViewModel, avoid Activity references
4. **Large images**: Use Coil/Glide for caching and resizing
5. **Forgetting permissions**: Runtime permission requests
6. **Ignoring Android versions**: Test on multiple API levels
7. **Not handling back press**: OnBackPressedDispatcher
8. **Hardcoded strings**: Use strings.xml for localization
9. **Not using Proguard/R8**: Enable in release builds
10. **Ignoring battery**: Use WorkManager for background tasks

## Resources

**Official:**
- Kotlin Docs: https://kotlinlang.org/docs/home.html
- Compose Docs: https://developer.android.com/jetpack/compose
- Material 3: https://m3.material.io/
- Android Guides: https://developer.android.com/guide

**Community:**
- Android Weekly: https://androidweekly.net/
- Kt.Academy: https://kt.academy/
- Coding in Flow: https://codinginflow.com/
- Philipp Lackner: https://pl-coding.com/


### mobile best practices

# Mobile Development Best Practices

Cross-platform best practices for modern mobile development (2024-2025).

## Mobile-First Design Principles

### Core Principles
1. **Content First**: Remove chrome, focus on content
2. **Progressive Disclosure**: Hide complexity behind layers
3. **Thumb-Friendly**: Primary actions within reach
4. **Performance Budget**: <2s launch, <1s screen load
5. **Offline-First**: Design for unreliable networks

### Touch Targets
- **iOS**: 44x44px minimum (HIG guideline)
- **Android**: 48x48px minimum (Material Design)
- **Optimal**: 44-57px for important actions
- **Spacing**: 8px minimum between targets

### Typography
- **iOS**: San Francisco (system font)
- **Android**: Roboto (Material)
- **Minimum**: 16px body text (accessibility)
- **Line height**: 1.5x for readability

## Performance Optimization

### Launch Time Optimization
**Targets:**
- Cold start: <2s
- Warm start: <1s
- Hot start: <0.5s

**Techniques:**
- Defer non-critical initialization
- Lazy load dependencies
- Preload critical data only
- Show UI before data ready

### Memory Management
**Targets:**
- Typical screen: <100MB
- Peak usage: <200MB

**Techniques:**
- Image pagination/virtualization
- Release resources in background
- Profile with Instruments/Profiler
- Avoid retain cycles/memory leaks

**React Native Example:**
```javascript
// Use FlatList instead of ScrollView for long lists
<FlatList
  data={items}
  renderItem={({ item }) => <ItemCard item={item} />}
  keyExtractor={(item) => item.id}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Network Optimization
**Techniques:**
- Batch API requests
- Cache aggressively
- Compress images (WebP, AVIF)
- Use CDN for static assets
- Implement request deduplication

**Example Strategy:**
```
User opens screen
├─ Show cached data immediately (stale-while-revalidate)
├─ Fetch fresh data in background
└─ Update UI when fresh data arrives
```

### Battery Optimization
**Techniques:**
- Batch network requests
- Reduce GPS accuracy when possible
- Use push instead of polling
- Respect Doze Mode (Android)
- Background App Refresh (iOS)

**Targets:**
- Active use: <5% per hour
- Background: <1% per hour

## Offline-First Architecture

### Local Storage Options
**React Native:**
- AsyncStorage (small data, <6MB)
- Realm (complex objects, relationships)
- SQLite (relational data)
- MMKV (fastest key-value)

**Flutter:**
- SharedPreferences (small data)
- Hive (NoSQL, fast)
- Drift (SQLite wrapper)
- ObjectBox (object database)

**iOS:**
- UserDefaults (small data)
- Core Data (complex objects)
- SwiftData (modern replacement)
- Realm

**Android:**
- SharedPreferences (small data)
- Room (SQLite ORM)
- Realm
- DataStore (Preferences + Proto)

### Data Synchronization Strategies

**1. Write-Through Cache**
```
User makes change
├─ Update local database immediately
├─ Update UI optimistically
├─ Queue sync operation
└─ Sync to server in background
```

**2. Hybrid Sync (Push + Pull)**
```
Push Sync (Real-time)
├─ WebSocket connection for critical updates
└─ Immediate notification of changes

Pull Sync (Periodic)
├─ Periodic polling for non-critical data
├─ Pull on app foreground
└─ Incremental sync (only changes since last sync)
```

**3. Conflict Resolution**
- **Last-write-wins**: Use timestamps
- **Operational transformation**: Merge changes
- **CRDT**: Conflict-free replicated data
- **Manual resolution**: User chooses

### Example: Offline-First Comments

```typescript
// React Native + TypeScript
class CommentService {
  async postComment(text: string, postId: string) {
    const tempId = generateTempId();
    const comment = {
      id: tempId,
      text,
      postId,
      synced: false,
      timestamp: Date.now()
    };

    // 1. Save locally immediately
    await db.comments.insert(comment);

    // 2. Update UI (optimistic)
    eventBus.emit('comment:added', comment);

    // 3. Sync to server in background
    try {
      const serverComment = await api.postComment(text, postId);
      // Replace temp ID with server ID
      await db.comments.update(tempId, {
        id: serverComment.id,
        synced: true
      });
    } catch (error) {
      // Mark as pending sync, retry later
      await db.comments.update(tempId, {
        syncError: error.message
      });
      syncQueue.add({ type: 'comment', id: tempId });
    }
  }
}
```

## Mobile Analytics & Monitoring

### Analytics Platforms (2024-2025)

**Firebase Analytics (Recommended)**
- Free tier generous
- Mobile-specific events
- Integrated with Crashlytics
- AI-powered insights
- Supports all platforms

**Sentry**
- Error tracking + performance
- Cross-platform support
- Source map upload
- Release tracking
- Custom breadcrumbs

**Amplitude**
- Product analytics
- User behavior tracking
- Cohort analysis
- A/B testing integration

### Essential Events to Track

**User Journey:**
- App opened
- Screen viewed
- Feature used
- Conversion events
- User retention

**Performance:**
- App launch time
- Screen load time
- API latency
- Crash-free rate
- ANR rate (Android)

**Business:**
- Purchases
- Subscriptions
- Ad impressions
- Feature adoption
- Referrals

### Crashlytics Integration

**React Native:**
```javascript
import crashlytics from '@react-native-firebase/crashlytics';

// Log events
crashlytics().log('User tapped purchase button');

// Set user attributes
crashlytics().setUserId(user.id);

// Log non-fatal errors
try {
  await riskyOperation();
} catch (error) {
  crashlytics().recordError(error);
}
```

**Flutter:**
```dart
import 'package:firebase_crashlytics/firebase_crashlytics.dart';

// Log events
FirebaseCrashlytics.instance.log('User tapped purchase');

// Set user ID
FirebaseCrashlytics.instance.setUserIdentifier(userId);

// Record errors
await FirebaseCrashlytics.instance.recordError(
  error,
  stackTrace,
  reason: 'API call failed',
);
```

## Push Notifications Best Practices

### Platforms
- **iOS**: APNs (Apple Push Notification service)
- **Android**: FCM (Firebase Cloud Messaging)
- **Cross-platform**: OneSignal, Firebase, AWS SNS

### Best Practices

**1. Permission Request Strategy**
```
❌ Bad: Request permission on app launch
✅ Good: Request after user sees value

Flow:
1. User interacts with feature
2. Show custom modal explaining benefits
3. Request system permission
4. Handle denial gracefully
```

**2. Personalization**
- Segment users by behavior
- Send at optimal times (time zones)
- Personalize content
- A/B test messaging

**3. Frequency**
- Avoid notification spam
- Respect user preferences
- Implement quiet hours
- Group related notifications

**4. Deep Linking**
```javascript
// React Native
import messaging from '@react-native-firebase/messaging';

messaging().onNotificationOpenedApp(remoteMessage => {
  const { screen, params } = remoteMessage.data;
  navigation.navigate(screen, params);
});
```

**Impact:**
- 25% revenue increase with proper personalization
- 88% opt-in rate with pre-permission modal (vs 40% without)

## Authentication & Authorization

### Modern Auth Stack (2024-2025)

**Standard Pattern:**
```
OAuth 2.0 (Authorization)
├─ JWT (Stateless auth tokens)
├─ Refresh tokens (Long-term access)
└─ Biometric (Convenient re-auth)
```

### Implementation

**Biometric Authentication (iOS)**
```swift
import LocalAuthentication

let context = LAContext()
var error: NSError?

if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
    context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,
                          localizedReason: "Unlock your account") { success, error in
        if success {
            // Authenticated
        }
    }
}
```

**Biometric Authentication (Android)**
```kotlin
import androidx.biometric.BiometricPrompt

val promptInfo = BiometricPrompt.PromptInfo.Builder()
    .setTitle("Biometric login")
    .setSubtitle("Log in using your biometric credential")
    .setNegativeButtonText("Use account password")
    .build()

val biometricPrompt = BiometricPrompt(this, executor,
    object : BiometricPrompt.AuthenticationCallback() {
        override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
            // Authenticated
        }
    })

biometricPrompt.authenticate(promptInfo)
```

### Secure Token Storage

**iOS: Keychain**
```swift
import Security

func saveToken(_ token: String, for key: String) {
    let data = token.data(using: .utf8)!
    let query: [String: Any] = [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrAccount as String: key,
        kSecValueData as String: data,
        kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
    ]
    SecItemAdd(query as CFDictionary, nil)
}
```

**Android: EncryptedSharedPreferences**
```kotlin
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val sharedPreferences = EncryptedSharedPreferences.create(
    context,
    "secure_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)

sharedPreferences.edit().putString("auth_token", token).apply()
```

**React Native: react-native-keychain**
```javascript
import * as Keychain from 'react-native-keychain';

// Save credentials
await Keychain.setGenericPassword('username', token, {
  accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
  accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
});

// Retrieve credentials
const credentials = await Keychain.getGenericPassword();
const token = credentials.password;
```

## App Store Deployment

### App Store (iOS)

**Requirements (2024-2025):**
- Xcode 15+ with iOS 17 SDK (minimum)
- Xcode 16+ with iOS 18 SDK (recommended for 2025)
- Privacy manifest required
- Account deletion in-app mandatory

**Release Process:**
1. Archive in Xcode
2. Upload to App Store Connect
3. Submit for review
4. Phased release (7-day rollout)

**Review Time:**
- Average: 1-2 days
- Expedited: 1-2 hours (emergencies only)

**Rejection Reasons:**
- Crashes (50%)
- Privacy violations (25%)
- Incomplete information (15%)
- Guideline violations (10%)

### Google Play (Android)

**Requirements (2024-2025):**
- Target Android 14 (API 34) now
- Target Android 15 (API 35) by Aug 31, 2025
- Privacy policy required
- Data safety form required

**Release Process:**
1. Build signed AAB (Android App Bundle)
2. Upload to Play Console
3. Submit to production track
4. Staged rollout (10% → 50% → 100%)

**Review Time:**
- Average: 1-3 days
- Updates: 1-2 days

### Staged Rollout Strategy

**Week 1:**
- 10% of users
- Monitor crash-free rate
- Watch for critical bugs

**Week 2:**
- 50% of users
- Validate performance metrics
- Check user feedback

**Week 3:**
- 100% of users
- Full release if metrics healthy

**Rollback Triggers:**
- Crash-free rate drops >5%
- Critical bug discovered
- Major user complaints

## Cross-Platform Comparison

### Flutter vs React Native (2024-2025)

| Metric | React Native | Flutter |
|--------|--------------|---------|
| **Adoption** | 35% | 46% |
| **Performance** | 80-90% | 85-95% |
| **App Size** | 40-50MB | 15-20MB |
| **Dev Speed** | Fast | Very Fast |
| **Commercial** | 12.57% | 5.24% |
| **Developers** | 20:1 ratio | 1 ratio |
| **Best For** | JS teams | Performance |

### Architecture Comparison

**MVVM (Small Apps):**
```
View
 ↓
ViewModel (business logic)
 ↓
Model (data)
```

**Clean Architecture (Large Apps):**
```
Presentation (UI)
 ↓
Domain (business logic, use cases)
 ↓
Data (repositories, APIs, DB)
```

## Resources

**Performance:**
- iOS: https://developer.apple.com/documentation/xcode/improving-your-app-s-performance
- Android: https://developer.android.com/topic/performance
- React Native: https://reactnative.dev/docs/performance

**Analytics:**
- Firebase: https://firebase.google.com/docs/analytics
- Sentry: https://docs.sentry.io/platforms/react-native/
- Amplitude: https://amplitude.com/docs

**Security:**
- OWASP Mobile: https://owasp.org/www-project-mobile-top-10/
- iOS Security: https://support.apple.com/guide/security/
- Android Security: https://source.android.com/docs/security

**Testing:**
- Detox: https://wix.github.io/Detox/
- Appium: https://appium.io/docs/en/latest/
- XCTest: https://developer.apple.com/documentation/xctest
- Espresso: https://developer.android.com/training/testing/espresso


### mobile debugging

# Mobile Debugging Strategies

Comprehensive debugging techniques, tools, and best practices for mobile development (2024-2025).

## Mobile Debugging Mindset

### Unique Mobile Challenges

1. **Device Diversity** - Thousands of device/OS combinations
2. **Resource Constraints** - Limited CPU, memory, battery
3. **Network Variability** - From WiFi to 2G, offline scenarios
4. **Platform Differences** - iOS vs Android behavior
5. **Real Device Testing** - Simulators don't show real performance
6. **Limited Debugging Access** - Can't SSH into production devices

### Debugging Philosophy

**Golden Rules:**
1. **Test on real devices** - Simulators lie about performance
2. **Reproduce consistently** - Intermittent bugs need reproducible steps
3. **Check the obvious first** - Network, permissions, resources
4. **Isolate the platform** - Is it iOS-specific, Android-specific, or both?
5. **Monitor resources** - CPU, memory, battery, network
6. **Read the logs** - Device logs contain critical clues

## Platform-Specific Debugging Tools

### iOS Debugging

**1. Xcode Debugger**

```swift
// Breakpoint debugging
func fetchUserData(userId: String) {
    // Set breakpoint here
    let url = URL(string: "https://api.example.com/users/\(userId)")!

    // LLDB commands:
    // po userId - print object
    // p url - print variable
    // bt - backtrace
    // c - continue
    // step - step into
    // next - step over
}
```

**LLDB Advanced Commands:**
```bash
# Conditional breakpoint
breakpoint set --name fetchUserData --condition userId == "123"

# Watchpoint (break on value change)
watchpoint set variable self.counter

# Print view hierarchy
po UIApplication.shared.keyWindow?.value(forKey: "recursiveDescription")

# Print all properties
po self.value(forKey: "description")
```

**2. Instruments (Performance Profiling)**

**Time Profiler** - CPU usage
```
1. Xcode → Product → Profile
2. Select "Time Profiler"
3. Record while using app
4. Identify hot methods (high self time)
```

**Allocations** - Memory usage
```
1. Select "Allocations" instrument
2. Look for memory growth
3. Filter by object type
4. Find allocation stack trace
```

**Leaks** - Memory leaks
```
1. Select "Leaks" instrument
2. Leaks shown in red
3. Click leak for stack trace
4. Fix retain cycles
```

**Network** - API debugging
```
1. Select "Network" instrument
2. See all HTTP requests
3. Response times, sizes
4. Failed requests highlighted
```

**3. View Debugging**

```swift
// View hierarchy in Xcode
// Debug → View Debugging → Capture View Hierarchy

// Runtime inspection
#if DEBUG
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello")
        }
        .onAppear {
            // Print view tree for debugging
            print(Mirror(reflecting: self.body))
        }
    }
}
#endif
```

**4. Console.app (System Logs)**

```bash
# Filter logs by process
log stream --predicate 'processImagePath contains "YourApp"' --level debug

# Filter by subsystem
log stream --predicate 'subsystem == "com.yourcompany.yourapp"'

# Show only errors
log stream --predicate 'processImagePath contains "YourApp"' --level error
```

**5. Network Link Conditioner**

```
Settings → Developer → Network Link Conditioner

Simulate:
- 3G, LTE, WiFi
- High latency
- Packet loss
- Bandwidth limits
```

### Android Debugging

**1. Android Studio Debugger**

```kotlin
// Breakpoint debugging
fun fetchUserData(userId: String) {
    // Set breakpoint here
    val url = "https://api.example.com/users/$userId"

    // Debugger commands:
    // Evaluate expression: Alt+F8 (Windows) / Cmd+F8 (Mac)
    // Step over: F8
    // Step into: F7
    // Resume: F9
}
```

**Advanced Debugger Features:**
```kotlin
// Conditional breakpoint
// Right-click breakpoint → Condition: userId == "123"

// Logpoint (log without stopping)
// Right-click breakpoint → More → Check "Evaluate and log"

// Exception breakpoint
// Run → View Breakpoints → + → Java Exception Breakpoints
```

**2. Android Profiler**

**CPU Profiler:**
```
View → Tool Windows → Profiler → CPU
- Record trace
- Identify slow methods
- Flame chart shows call hierarchy
```

**Memory Profiler:**
```
View → Tool Windows → Profiler → Memory
- Track allocations
- Heap dump analysis
- Find memory leaks
```

**Network Profiler:**
```
View → Tool Windows → Profiler → Network
- All HTTP requests
- Request/response details
- Timeline view
```

**3. Layout Inspector**

```
Tools → Layout Inspector

Features:
- 3D view hierarchy
- Live layout updates
- View properties
- Constraints visualization
```

**4. ADB (Android Debug Bridge)**

```bash
# View device logs
adb logcat

# Filter by app
adb logcat | grep com.yourcompany.yourapp

# Filter by tag
adb logcat MyTag:D *:S

# Clear logs
adb logcat -c

# Install APK
adb install app-debug.apk

# Uninstall app
adb uninstall com.yourcompany.yourapp

# Take screenshot
adb shell screencap -p /sdcard/screenshot.png
adb pull /sdcard/screenshot.png

# Screen recording
adb shell screenrecord /sdcard/demo.mp4
adb pull /sdcard/demo.mp4
```

**5. Network Simulation**

```bash
# Emulator network throttling
# Settings → Network → Network Profile

# Or via ADB
adb shell setprop net.dns1 8.8.8.8
```

### React Native Debugging

**1. React DevTools**

```bash
# Install
npm install -g react-devtools

# Launch
react-devtools

# In app: Shake device → "Debug with React DevTools"
```

**2. Flipper (Recommended)**

```bash
# Install
npm install -g flipper

# Configure in app
# Add flipper packages to your app
npm install --save-dev react-native-flipper

# Features:
# - Layout inspector
# - Network inspector
# - Redux DevTools
# - Database viewer
# - Shared Preferences viewer
```

**3. Chrome DevTools**

```javascript
// In app: Shake device → "Debug"
// Opens Chrome DevTools

// Console.log appears in Chrome
console.log('User data:', userData);

// Set breakpoints in source code
debugger; // Pauses execution

// Network tab shows API calls
fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(data => console.log(data));
```

**4. React Native Debugger (Standalone)**

```bash
# Install
brew install --cask react-native-debugger

# Launch
open "rndebugger://set-debugger-loc?host=localhost&port=8081"

# Features:
# - Redux DevTools
# - React DevTools
# - Network Inspector
# - Console
```

**5. Performance Monitor**

```javascript
// Show in-app performance overlay
// Shake device → "Show Perf Monitor"

// Shows:
// - RAM usage
// - JS frame rate
// - UI frame rate
// - Views count
```

**6. LogBox**

```javascript
// Ignore specific warnings
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Warning: componentWillReceiveProps',
]);

// Ignore all logs (NOT recommended)
LogBox.ignoreAllLogs();
```

### Flutter Debugging

**1. DevTools**

```bash
# Launch from VS Code
# Debug → Open DevTools

# Or from command line
flutter pub global activate devtools
flutter pub global run devtools

# Features:
# - Widget inspector
# - Timeline view
# - Memory profiler
# - Network profiler
# - Logging view
```

**2. Widget Inspector**

```dart
// In DevTools: Inspector tab

// Debug paint (show layout borders)
// Ctrl+Shift+P → "Toggle Debug Painting"

// Print widget tree
debugDumpApp();

// Print render tree
debugDumpRenderTree();

// Print layer tree
debugDumpLayerTree();
```

**3. Performance Overlay**

```dart
void main() {
  runApp(
    MaterialApp(
      showPerformanceOverlay: true, // FPS counter
      debugShowCheckedModeBanner: false,
      home: MyApp(),
    ),
  );
}
```

**4. Logging**

```dart
import 'dart:developer' as developer;

// Simple print
print('User ID: $userId');

// Structured logging
developer.log(
  'User logged in',
  name: 'app.auth',
  error: error,
  stackTrace: stackTrace,
);

// Timeline events
developer.Timeline.startSync('fetchUsers');
await fetchUsers();
developer.Timeline.finishSync();
```

**5. Breakpoint Debugging**

```dart
// Set breakpoints in VS Code or Android Studio
Future<User> fetchUser(String id) async {
  // Breakpoint here
  final response = await http.get(Uri.parse('https://api.example.com/users/$id'));

  // Debugger console commands:
  // p variable - print variable
  // Step over: F10
  // Step into: F11
  // Continue: F5
  return User.fromJson(jsonDecode(response.body));
}
```

## UI Debugging

### Layout Issues

**iOS (SwiftUI):**
```swift
struct ContentView: View {
    var body: some View {
        VStack {
            Text("Hello")
        }
        .border(Color.red) // Debug border
        .background(Color.yellow.opacity(0.3)) // Debug background
    }
}

// Print layout info
Text("Hello")
    .onAppear {
        print("Frame: \(UIScreen.main.bounds)")
    }
```

**Android (Jetpack Compose):**
```kotlin
@Composable
fun DebugLayout() {
    Column(
        modifier = Modifier
            .border(2.dp, Color.Red) // Debug border
            .background(Color.Yellow.copy(alpha = 0.3f)) // Debug background
    ) {
        Text("Hello")
    }
}

// Show layout bounds in developer options
// Settings → Developer Options → Show layout bounds
```

**React Native:**
```javascript
// Debug borders
<View style={{ borderWidth: 1, borderColor: 'red' }}>
  <Text>Hello</Text>
</View>

// Layout animation debugging
import { LayoutAnimation, UIManager } from 'react-native';

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

// Inspector
// Shake device → "Toggle Inspector"
// Shows element hierarchy and styles
```

**Flutter:**
```dart
// Debug paint
void main() {
  debugPaintSizeEnabled = true; // Show layout guides
  debugPaintBaselinesEnabled = true; // Show text baselines
  debugPaintLayerBordersEnabled = true; // Show layer borders
  runApp(MyApp());
}

// Widget boundaries
Container(
  decoration: BoxDecoration(
    border: Border.all(color: Colors.red, width: 2),
  ),
  child: Text('Hello'),
)
```

### Animation Debugging

**Slow Animations:**
```dart
// Flutter: Slow down animations
timeDilation = 5.0; // 5x slower

// React Native: Slow animations
import { Animated } from 'react-native';
Animated.timing(value, {
  toValue: 1,
  duration: 3000, // Increase duration
});
```

**Animation Performance:**
```swift
// iOS: Core Animation Instrument
// Instruments → Core Animation
// Check for:
// - Dropped frames
// - Off-screen rendering
// - Blending layers
```

## Performance Debugging

### Frame Rate Issues (< 60 FPS)

**Diagnosis:**

**React Native:**
```javascript
// Enable performance monitor
// Shows JS and UI thread FPS

// Common issues:
// 1. Heavy computations in render
// 2. Large lists without virtualization
// 3. Unnecessary re-renders
```

**Solutions:**
```javascript
// ❌ Bad: Heavy computation in render
function UserList({ users }) {
  const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
  return <FlatList data={sortedUsers} />;
}

// ✅ Good: Memoize expensive operations
function UserList({ users }) {
  const sortedUsers = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  );
  return <FlatList data={sortedUsers} />;
}

// ❌ Bad: ScrollView with large data
<ScrollView>
  {users.map(user => <UserCard key={user.id} user={user} />)}
</ScrollView>

// ✅ Good: FlatList with virtualization
<FlatList
  data={users}
  renderItem={({ item }) => <UserCard user={item} />}
  keyExtractor={item => item.id}
  windowSize={5}
  initialNumToRender={10}
/>
```

**Flutter:**
```dart
// Check for:
// - Build phase too long
// - Layout phase too long
// - Paint phase too long

// Use const constructors
// ❌ Bad
Widget build(BuildContext context) {
  return Container(child: Text('Hello'));
}

// ✅ Good
Widget build(BuildContext context) {
  return const Text('Hello');
}

// Avoid expensive builds
// Use keys for stateful widgets
ListView.builder(
  itemBuilder: (context, index) {
    return UserCard(
      key: ValueKey(users[index].id), // Preserve state
      user: users[index],
    );
  },
)
```

### Memory Issues

**Detection:**

**iOS:**
```
Xcode → Debug Navigator → Memory
- Watch memory graph
- Look for continuous growth
```

**Android:**
```
Android Studio → Profiler → Memory
- Take heap dump
- Analyze retained objects
```

**Common Causes:**

```javascript
// React Native: Memory leaks

// ❌ Bad: Event listener not removed
useEffect(() => {
  EventEmitter.on('data', handleData);
  // Missing cleanup
}, []);

// ✅ Good: Cleanup
useEffect(() => {
  EventEmitter.on('data', handleData);
  return () => {
    EventEmitter.off('data', handleData);
  };
}, []);

// ❌ Bad: Timer not cleared
useEffect(() => {
  setInterval(() => {
    console.log('tick');
  }, 1000);
}, []);

// ✅ Good: Clear timer
useEffect(() => {
  const timer = setInterval(() => {
    console.log('tick');
  }, 1000);
  return () => clearInterval(timer);
}, []);
```

```dart
// Flutter: Dispose controllers
class MyWidget extends StatefulWidget {
  @override
  _MyWidgetState createState() => _MyWidgetState();
}

class _MyWidgetState extends State<MyWidget> {
  late TextEditingController _controller;

  @override
  void initState() {
    super.initState();
    _controller = TextEditingController();
  }

  @override
  void dispose() {
    _controller.dispose(); // Must dispose
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(controller: _controller);
  }
}
```

## Network Debugging

### HTTP Debugging

**iOS (Proxyman / Charles)**
```
1. Install Proxyman (free) or Charles
2. Configure device proxy
3. Install SSL certificate
4. View all HTTP traffic
```

**Android (Charles / Flipper)**
```
1. Install Charles Proxy
2. Configure device proxy: Settings → WiFi → Modify → Proxy
3. Install Charles certificate
4. View all HTTP requests/responses
```

**React Native (Flipper Network Plugin)**
```javascript
// Automatically captures all fetch/axios requests
fetch('https://api.example.com/users')
  .then(res => res.json())
  .then(data => console.log(data));

// View in Flipper:
// - Request/response headers
// - Request/response body
// - Timing information
```

**Flutter (DevTools Network Tab)**
```dart
// Automatically captures HTTP requests
final response = await http.get(
  Uri.parse('https://api.example.com/users')
);

// View in DevTools Network tab:
// - All HTTP requests
// - Headers and body
// - Response times
```

### Network Simulation

**Test scenarios:**
- Slow network (3G, 2G)
- High latency (500ms+)
- Packet loss (10%)
- Offline mode

**iOS:**
```
Settings → Developer → Network Link Conditioner
```

**Android:**
```
Emulator: Settings → Network → Network Profile
```

## Crash Debugging

### Crash Reporting Services

**Firebase Crashlytics (Recommended)**

**React Native:**
```javascript
import crashlytics from '@react-native-firebase/crashlytics';

// Log custom events
crashlytics().log('User pressed purchase button');

// Set user identifier
crashlytics().setUserId(userId);

// Record non-fatal error
try {
  await fetchData();
} catch (error) {
  crashlytics().recordError(error);
}

// Force crash for testing
crashlytics().crash();
```

**Flutter:**
```dart
import 'package:firebase_crashlytics/firebase_crashlytics.dart';

// Catch errors
FlutterError.onError = FirebaseCrashlytics.instance.recordFlutterError;

// Catch async errors
runZonedGuarded(() {
  runApp(MyApp());
}, (error, stackTrace) {
  FirebaseCrashlytics.instance.recordError(error, stackTrace);
});

// Log custom events
FirebaseCrashlytics.instance.log('User pressed purchase');

// Set user ID
FirebaseCrashlytics.instance.setUserIdentifier(userId);
```

**iOS Native:**
```swift
import FirebaseCrashlytics

// Log event
Crashlytics.crashlytics().log("User tapped button")

// Set user ID
Crashlytics.crashlytics().setUserID(userId)

// Record error
Crashlytics.crashlytics().record(error: error)
```

**Android Native:**
```kotlin
import com.google.firebase.crashlytics.FirebaseCrashlytics

// Log event
FirebaseCrashlytics.getInstance().log("User tapped button")

// Set user ID
FirebaseCrashlytics.getInstance().setUserId(userId)

// Record exception
FirebaseCrashlytics.getInstance().recordException(exception)
```

### Analyzing Crash Reports

**iOS (Xcode Organizer):**
```
Window → Organizer → Crashes
- Symbolicated crash logs
- Stack traces
- Crash counts
```

**Android (Play Console):**
```
Play Console → Quality → Crashes & ANRs
- Crash stack traces
- Affected devices
- OS versions
```

**Reading Stack Traces:**
```
Fatal Exception: java.lang.NullPointerException
Attempt to invoke virtual method 'java.lang.String User.getName()' on a null object reference
    at com.example.app.UserService.displayUser(UserService.kt:42)
    at com.example.app.MainActivity.onCreate(MainActivity.kt:23)

Fix:
1. Check line UserService.kt:42
2. User object is null
3. Add null check before accessing getName()
```

## Common Debugging Scenarios

### 1. App Crashes on Startup

**Steps:**
1. Check crash logs
2. Look for initialization errors
3. Verify dependencies loaded
4. Check permissions

**Example:**
```javascript
// React Native: Missing native dependency
// Error: Invariant Violation: Native module cannot be null

// Fix: Link native module
npx react-native link <module-name>
# or
cd ios && pod install
```

### 2. UI Not Updating

**React Native:**
```javascript
// ❌ Bad: Mutating state directly
this.state.users.push(newUser); // Won't trigger re-render

// ✅ Good: Create new state
this.setState({ users: [...this.state.users, newUser] });
```

**Flutter:**
```dart
// ❌ Bad: Not calling setState
void addUser(User user) {
  users.add(user); // Won't rebuild
}

// ✅ Good: Call setState
void addUser(User user) {
  setState(() {
    users.add(user);
  });
}
```

### 3. Image Not Loading

**Common causes:**
1. Wrong URL
2. CORS issues
3. SSL certificate issues
4. Network timeout

**Debugging:**
```javascript
// React Native
<Image
  source={{ uri: imageUrl }}
  onError={(error) => console.log('Image error:', error)}
  onLoad={() => console.log('Image loaded')}
/>

// Check network tab for 404, 403, etc.
```

### 4. Keyboard Covering Input

**React Native:**
```javascript
import { KeyboardAvoidingView } from 'react-native';

<KeyboardAvoidingView
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
  style={{ flex: 1 }}
>
  <TextInput placeholder="Email" />
</KeyboardAvoidingView>
```

**Flutter:**
```dart
// Automatically handled by Scaffold
Scaffold(
  resizeToAvoidBottomInset: true, // Default
  body: TextField(),
)
```

### 5. Navigation Not Working

**React Navigation:**
```javascript
// ❌ Bad: Navigation prop not available
function MyComponent() {
  navigation.navigate('Home'); // Error
}

// ✅ Good: Use hook or prop
function MyComponent({ navigation }) {
  // or
  // const navigation = useNavigation();

  navigation.navigate('Home');
}
```

## Production Debugging

### Remote Logging

**LogRocket (Session Replay)**
```javascript
import LogRocket from '@logrocket/react-native';

LogRocket.init('your-app-id');

// Identify users
LogRocket.identify(userId, {
  name: user.name,
  email: user.email,
});

// Replays user sessions with:
// - Console logs
// - Network requests
// - UI interactions
// - Redux actions
```

### Feature Flags for Debugging

```javascript
import { useFlags } from 'launchdarkly-react-native-client-sdk';

function MyComponent() {
  const { debugMode } = useFlags();

  if (debugMode) {
    console.log('Debug info:', userData);
  }

  return <View>...</View>;
}

// Enable debug mode remotely for specific users
```

### A/B Testing for Bug Investigation

```javascript
// Gradually roll out fix
if (abTest.variant === 'fixed') {
  return <FixedComponent />;
} else {
  return <OriginalComponent />;
}

// Monitor crash rates per variant
```

## Debugging Checklist

**Before Filing Bug:**
- [ ] Reproduce on real device
- [ ] Check both iOS and Android
- [ ] Test on multiple OS versions
- [ ] Verify network connectivity
- [ ] Check app permissions
- [ ] Review recent code changes
- [ ] Check crash logs

**Investigation:**
- [ ] Enable debug logging
- [ ] Use platform debugger
- [ ] Profile performance if slow
- [ ] Monitor memory usage
- [ ] Check network requests
- [ ] Inspect UI hierarchy

**Production Issues:**
- [ ] Check crash reporting dashboard
- [ ] Review user-reported issues
- [ ] Analyze affected OS versions
- [ ] Check affected devices
- [ ] Review recent app releases
- [ ] Compare crash-free rates

**After Fix:**
- [ ] Test on real devices
- [ ] Verify on affected OS versions
- [ ] Add regression test
- [ ] Staged rollout (10% → 100%)
- [ ] Monitor crash rates

## Resources

**General:**
- React Native Debugging: https://reactnative.dev/docs/debugging
- Flutter DevTools: https://docs.flutter.dev/tools/devtools
- iOS Debugging: https://developer.apple.com/documentation/xcode/debugging
- Android Debugging: https://developer.android.com/studio/debug

**Crash Reporting:**
- Firebase Crashlytics: https://firebase.google.com/docs/crashlytics
- Sentry: https://docs.sentry.io/platforms/react-native/
- Bugsnag: https://docs.bugsnag.com/

**Performance:**
- iOS Instruments: https://developer.apple.com/instruments/
- Android Profiler: https://developer.android.com/studio/profile
- Flipper: https://fbflipper.com/

**Network:**
- Proxyman: https://proxyman.io/
- Charles Proxy: https://www.charlesproxy.com/
- Flipper Network Plugin: https://fbflipper.com/docs/features/network-plugin/


### mobile frameworks

# Mobile Frameworks Reference

Comprehensive guide to mobile development frameworks: React Native, Flutter, and native development.

## Framework Overview (2024-2025)

### React Native
- **Language**: JavaScript/TypeScript
- **Stars**: 121,000+ on GitHub
- **Adoption**: 35% of mobile developers, 67% familiarity
- **Performance**: 80-90% native performance
- **Architecture**: Bridge-based (legacy) → New Architecture (JSI, Fabric, Codegen)
- **Rendering**: Native components
- **Hot Reload**: Yes
- **Community**: Huge (npm ecosystem, 3M+ downloads/week)

### Flutter
- **Language**: Dart
- **Stars**: 170,000+ on GitHub (fastest-growing)
- **Adoption**: 46% of mobile developers
- **Performance**: 85-95% native performance
- **Architecture**: "Everything is a widget"
- **Rendering**: Custom Impeller rendering engine (eliminates jank)
- **Hot Reload**: Yes (fastest in industry)
- **Community**: Growing rapidly (23,000+ packages on pub.dev)

### Native iOS (Swift/SwiftUI)
- **Language**: Swift
- **Performance**: 100% native
- **UI Framework**: SwiftUI (declarative) or UIKit (imperative)
- **Latest**: Swift 6 with compile-time data race detection
- **Tooling**: Xcode 16, Swift Package Manager
- **Concurrency**: async/await, actors, @MainActor

### Native Android (Kotlin/Jetpack Compose)
- **Language**: Kotlin
- **Performance**: 100% native
- **UI Framework**: Jetpack Compose (declarative) or Views (imperative)
- **Latest**: Kotlin 2.1, Compose 1.7
- **Tooling**: Android Studio Hedgehog+
- **Coroutines**: Kotlin coroutines for async

## React Native Deep Dive

### Core Concepts

**New Architecture (0.82+ Mandatory)**
- **JSI (JavaScript Interface)**: Direct JS-to-native communication, eliminating bridge
- **Fabric**: New rendering system with synchronous layout
- **Codegen**: Static type safety between JS and native code
- **Turbo Modules**: Lazy-loaded native modules

**Performance Optimizations**
- **Hermes Engine**: 30-40% faster startup, reduced memory
- **Native Driver Animations**: Offloaded to UI thread (60 FPS)
- **FlatList Virtualization**: Renders only visible items
- **Image Optimization**: FastImage library, progressive loading

### Best Practices

**Project Structure (Feature-Based)**
```
src/
├── features/
│   ├── auth/
│   ├── profile/
│   └── dashboard/
├── shared/
│   ├── components/
│   ├── hooks/
│   └── utils/
├── navigation/
├── services/
└── stores/
```

**State Management (2024-2025)**
1. **Zustand** (Rising Star): Minimal boilerplate, 3KB, excellent TypeScript
2. **Redux Toolkit**: Enterprise apps, time-travel debugging, DevTools
3. **Recoil**: Meta-built, atom-based, experimental
4. **Context API**: Simple apps, avoid prop drilling

**Navigation**
- **React Navigation**: Industry standard, 80%+ adoption
- Type-safe navigation with TypeScript
- Deep linking configuration
- Tab, stack, drawer navigators

**TypeScript Adoption**
- 85%+ of new React Native projects use TypeScript
- Type safety prevents 15% of runtime errors
- Better IDE support and autocomplete

### Testing Strategy

**Unit Testing**
- **Jest**: Default test runner
- **React Native Testing Library**: Component testing, best practices
- Target: 70-80%+ code coverage

**E2E Testing**
- **Detox**: Gray-box testing, fast, reliable (recommended)
- **Appium**: Cross-platform, WebDriver-based
- **Maestro**: New player, simple YAML-based tests

**Example (React Native Testing Library)**
```javascript
import { render, fireEvent, waitFor } from '@testing-library/react-native';

test('login button should be enabled when form is valid', async () => {
  const { getByTestId } = render(<LoginScreen />);
  const emailInput = getByTestId('email-input');
  const passwordInput = getByTestId('password-input');
  const loginButton = getByTestId('login-button');

  fireEvent.changeText(emailInput, 'test@example.com');
  fireEvent.changeText(passwordInput, 'password123');

  await waitFor(() => {
    expect(loginButton).not.toBeDisabled();
  });
});
```

### When to Choose React Native

**✅ Best For:**
- JavaScript/TypeScript expertise in team
- Code sharing with web (React)
- Rapid prototyping and MVPs
- Strong community support needed
- npm ecosystem integration
- Commercial apps (12.57% market share)

**❌ Not Ideal For:**
- Heavy graphics/gaming (use native or Unity)
- Maximum performance critical
- Deep platform-specific integrations
- Team unfamiliar with JavaScript

## Flutter Deep Dive

### Core Concepts

**"Everything is a Widget"**
- UI built from composable widgets
- Immutable widget tree
- Reactive updates with setState/state management

**Rendering Engine**
- **Impeller**: New rendering engine (iOS stable, Android preview)
- Eliminates shader jank
- 120 FPS capable on capable devices
- Custom Skia-based rendering (full control)

**Performance Features**
- **Const widgets**: Compile-time optimization
- **RepaintBoundary**: Isolate expensive repaints
- **ListView.builder**: Lazy loading for long lists
- **Cached network images**: Image optimization

### Best Practices

**Project Structure (Feature-First)**
```
lib/
├── features/
│   ├── auth/
│   │   ├── data/
│   │   ├── domain/
│   │   └── presentation/
│   └── profile/
├── core/
│   ├── theme/
│   ├── utils/
│   └── widgets/
├── routing/
└── main.dart
```

**State Management (2024-2025)**
1. **Riverpod 3**: Modern, compile-safe, recommended by Flutter team
2. **Bloc**: Enterprise apps, event-driven, predictable state
3. **Provider**: Beginners, simple apps
4. **GetX**: All-in-one (state + routing + DI), opinionated

**Navigation**
- **GoRouter**: Official recommendation (2024+), declarative routing
- Type-safe routes with code generation
- Deep linking built-in
- Replaces Navigator 2.0 for most use cases

**Priority Levels (Official)**
1. **P0**: Fix immediately (crashes, data loss)
2. **P1**: Fix within days (major features broken)
3. **P2**: Fix within weeks (annoyances)
4. **P3**: Nice to have

### Testing Strategy

**Unit Testing**
- **flutter_test**: Built-in testing package
- **Mockito**: Mocking dependencies
- Target: 80%+ code coverage

**Widget Testing**
- **WidgetTester**: Test UI and interactions
- **Golden Tests**: Visual regression testing

**Integration Testing**
- **integration_test**: End-to-end testing
- Run on real devices or emulators

**Example (Widget Testing)**
```dart
testWidgets('Counter increments', (WidgetTester tester) async {
  await tester.pumpWidget(MyApp());

  expect(find.text('0'), findsOneWidget);
  expect(find.text('1'), findsNothing);

  await tester.tap(find.byIcon(Icons.add));
  await tester.pump();

  expect(find.text('0'), findsNothing);
  expect(find.text('1'), findsOneWidget);
});
```

### When to Choose Flutter

**✅ Best For:**
- Performance-critical applications
- Complex animations and custom UI
- Multi-platform (mobile, web, desktop)
- Consistent UI across platforms
- Growing team/startup (fastest development)
- Apps with heavy visual requirements

**❌ Not Ideal For:**
- Team unfamiliar with Dart
- Heavy reliance on native platform features
- Existing large JavaScript/native codebase
- Small app size critical (<20MB)

## Native iOS (Swift/SwiftUI)

### Core Concepts

**Swift 6 (2024-2025)**
- Compile-time data race detection
- Enhanced concurrency: async/await, actors, @MainActor
- Powerful macro system
- Move semantics for performance

**SwiftUI vs UIKit**
- **SwiftUI**: Declarative, 40% less code, iOS 13+, modern approach
- **UIKit**: Imperative, fine-grained control, legacy support, complex customizations
- Both work together in same project

### Architecture Patterns

**MVVM (Most Popular)**
```swift
// ViewModel (ObservableObject)
class LoginViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var isLoading = false

    func login() async {
        isLoading = true
        // Login logic
        isLoading = false
    }
}

// View
struct LoginView: View {
    @StateObject private var viewModel = LoginViewModel()

    var body: some View {
        VStack {
            TextField("Email", text: $viewModel.email)
            SecureField("Password", text: $viewModel.password)
            Button("Login") {
                Task { await viewModel.login() }
            }
        }
    }
}
```

**TCA (The Composable Architecture)**
- Growing adoption (v1.13+)
- Excellent for complex apps
- Steeper learning curve
- Predictable state management

### When to Choose Native iOS

**✅ Best For:**
- iOS-only applications
- Maximum performance required
- Latest Apple features (WidgetKit, Live Activities, App Clips)
- Deep iOS ecosystem integration
- Team with Swift/iOS expertise

## Native Android (Kotlin/Jetpack Compose)

### Core Concepts

**Kotlin 2.1 (2024-2025)**
- Null safety by design
- Coroutines for async
- Sealed classes for type-safe states
- Extension functions

**Jetpack Compose**
- Declarative UI (like SwiftUI/React)
- 60% adoption in top 1,000 apps
- Material Design 3 integration
- Compose compiler with Kotlin 2.0+

### Architecture Patterns

**MVVM + Clean Architecture**
```kotlin
// ViewModel
class LoginViewModel(
    private val loginUseCase: LoginUseCase
) : ViewModel() {
    private val _uiState = MutableStateFlow(LoginUiState())
    val uiState: StateFlow<LoginUiState> = _uiState.asStateFlow()

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            loginUseCase(email, password)
                .onSuccess { /* Navigate */ }
                .onFailure { /* Show error */ }
            _uiState.update { it.copy(isLoading = false) }
        }
    }
}

// Composable
@Composable
fun LoginScreen(viewModel: LoginViewModel = hiltViewModel()) {
    val uiState by viewModel.uiState.collectAsState()

    Column {
        TextField(
            value = uiState.email,
            onValueChange = { /* update */ }
        )
        Button(onClick = { viewModel.login() }) {
            Text("Login")
        }
    }
}
```

### When to Choose Native Android

**✅ Best For:**
- Android-only applications
- Maximum performance required
- Material Design 3 implementation
- Deep Android ecosystem integration
- Team with Kotlin/Android expertise

## Framework Comparison Matrix

| Feature | React Native | Flutter | Native iOS | Native Android |
|---------|--------------|---------|------------|----------------|
| **Language** | JavaScript/TS | Dart | Swift | Kotlin |
| **Learning Curve** | Easy | Medium | Medium | Medium |
| **Performance** | 80-90% | 85-95% | 100% | 100% |
| **Hot Reload** | Yes | Yes (fastest) | Previews | Live Edit |
| **Code Sharing** | Web (React) | Web/Desktop | No | No |
| **Community Size** | Huge | Growing | iOS only | Android only |
| **UI Paradigm** | Components | Widgets | Declarative | Declarative |
| **Third-party** | npm (3M+) | pub.dev (23K+) | SPM | Maven |
| **App Size** | 40-50MB | 15-20MB | 10-15MB | 10-15MB |
| **Build Time** | Medium | Fast | Slow (Xcode) | Medium |
| **Debugging** | Chrome/Safari | DevTools | Xcode | Android Studio |
| **Platform Feel** | Needs work | Needs work | Native | Native |
| **Startup Time** | Medium | Fast | Fastest | Fastest |
| **Best For** | JS teams | Performance | iOS-only | Android-only |

## Migration Paths

### React Native → Flutter
- **Effort**: High (complete rewrite)
- **Timeline**: 3-6 months for medium app
- **Benefits**: Better performance, smaller app size
- **Challenges**: New language (Dart), different ecosystem

### Flutter → React Native
- **Effort**: High (complete rewrite)
- **Timeline**: 3-6 months for medium app
- **Benefits**: Larger community, web code sharing
- **Challenges**: Lower performance, larger app size

### Cross-Platform → Native
- **Effort**: Very High (separate iOS and Android apps)
- **Timeline**: 6-12 months for medium app
- **Benefits**: Maximum performance, platform features
- **Challenges**: Maintain two codebases, 2x team size

### Native → Cross-Platform
- **Effort**: High (consolidate to one codebase)
- **Timeline**: 4-8 months for medium app
- **Benefits**: Single codebase, faster development
- **Challenges**: Performance tradeoffs, platform differences

## Decision Framework

### Start Here: Do you need native performance?
- **No** → Cross-platform (React Native or Flutter)
- **Yes** → Native (Swift or Kotlin)

### If Cross-Platform: Does team know JavaScript?
- **Yes** → React Native
- **No** → Flutter

### If Native: iOS-only or Android-only?
- **iOS-only** → Swift/SwiftUI
- **Android-only** → Kotlin/Compose
- **Both** → Reconsider cross-platform

### Additional Factors:
- **Existing codebase**: Use same technology
- **Web app exists**: React Native (code sharing)
- **Desktop needed**: Flutter (multi-platform)
- **Budget constrained**: Cross-platform
- **Performance critical**: Native
- **Complex animations**: Flutter or Native
- **Commercial focus**: React Native (larger market share)

## Resources

**React Native:**
- Official Docs: https://reactnative.dev/
- New Architecture: https://reactnative.dev/docs/the-new-architecture/landing-page
- Expo: https://expo.dev/ (recommended framework)
- Directory: https://reactnative.directory/

**Flutter:**
- Official Docs: https://flutter.dev/
- Pub.dev: https://pub.dev/
- Codelabs: https://flutter.dev/codelabs
- Widget Catalog: https://flutter.dev/widgets

**Native iOS:**
- Swift Docs: https://swift.org/documentation/
- SwiftUI Tutorials: https://developer.apple.com/tutorials/swiftui
- iOS HIG: https://developer.apple.com/design/human-interface-guidelines/

**Native Android:**
- Kotlin Docs: https://kotlinlang.org/docs/home.html
- Compose Docs: https://developer.android.com/jetpack/compose
- Material 3: https://m3.material.io/
- Android Guides: https://developer.android.com/guide


### mobile ios

# iOS Native Development

Complete guide to iOS development with Swift and SwiftUI (2024-2025).

## Swift 6 Overview

### Key Features
- **Data race safety**: Compile-time detection (default in Swift 6)
- **Concurrency**: async/await, actors, @MainActor
- **Macro system**: Code generation at compile time
- **Move semantics**: Ownership optimization
- **Enhanced generics**: More powerful type system

### Modern Swift Patterns

**Async/Await:**
```swift
func fetchUser(id: String) async throws -> User {
    let (data, _) = try await URLSession.shared.data(from: url)
    return try JSONDecoder().decode(User.self, from: data)
}

// Usage
Task {
    do {
        let user = try await fetchUser(id: "123")
        self.user = user
    } catch {
        self.error = error
    }
}
```

**Actors (Thread-safe classes):**
```swift
actor UserCache {
    private var cache: [String: User] = [:]

    func get(_ id: String) -> User? {
        cache[id]
    }

    func set(_ id: String, user: User) {
        cache[id] = user
    }
}
```

## SwiftUI vs UIKit

### When to Use SwiftUI
✅ New projects (iOS 13+)
✅ Declarative UI preferred
✅ Fast iteration needed
✅ Cross-platform (macOS, watchOS, tvOS)
✅ 40% less code vs UIKit

### When to Use UIKit
✅ Legacy app maintenance
✅ Complex customizations
✅ Fine-grained control needed
✅ Specific UIKit features required
✅ Pre-iOS 13 support

### SwiftUI Basics

```swift
struct ContentView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 20) {
            Text("Count: \(count)")
                .font(.title)

            Button("Increment") {
                count += 1
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}
```

**Property Wrappers:**
- `@State`: View-local state
- `@Binding`: Two-way binding
- `@StateObject`: Observable object owner
- `@ObservedObject`: Observable object reference
- `@EnvironmentObject`: Dependency injection
- `@Published`: Observable property

## Architecture Patterns

### MVVM (Most Popular)

```swift
// Model
struct User: Identifiable, Codable {
    let id: String
    let name: String
    let email: String
}

// ViewModel
@MainActor
class UserViewModel: ObservableObject {
    @Published var users: [User] = []
    @Published var isLoading = false
    @Published var error: Error?

    private let repository: UserRepository

    init(repository: UserRepository = UserRepository()) {
        self.repository = repository
    }

    func loadUsers() async {
        isLoading = true
        defer { isLoading = false }

        do {
            users = try await repository.fetchUsers()
        } catch {
            self.error = error
        }
    }
}

// View
struct UserListView: View {
    @StateObject private var viewModel = UserViewModel()

    var body: some View {
        List(viewModel.users) { user in
            Text(user.name)
        }
        .task {
            await viewModel.loadUsers()
        }
    }
}
```

### TCA (The Composable Architecture)

**When to use:**
- Complex state management
- Predictable state updates
- Excellent testing
- Enterprise apps

**Trade-offs:**
- Steeper learning curve
- More boilerplate
- Excellent for large teams

## Performance Optimization

### Compiler Optimizations

**1. Use `final` classes:**
```swift
final class FastClass {
    // Compiler can optimize (no dynamic dispatch)
}
```

**2. Private methods:**
```swift
private func optimize() {
    // Compiler can inline
}
```

**3. Whole-module optimization:**
```bash
# Build Settings
SWIFT_WHOLE_MODULE_OPTIMIZATION = YES
```

### Memory Management

**ARC (Automatic Reference Counting):**
```swift
class Parent {
    var child: Child?
}

class Child {
    weak var parent: Parent?  // Weak to avoid retain cycle
}
```

**Common Retain Cycles:**
```swift
// ❌ Bad: Retain cycle
class ViewController: UIViewController {
    var completion: (() -> Void)?

    func setup() {
        completion = {
            self.doSomething()  // Strong capture
        }
    }
}

// ✅ Good: Weak self
class ViewController: UIViewController {
    var completion: (() -> Void)?

    func setup() {
        completion = { [weak self] in
            self?.doSomething()
        }
    }
}
```

### SwiftUI Performance

**1. Use const modifiers:**
```swift
Text("Hello")  // Recreated on every render

vs

Text("Hello")
    .font(.title)  // Modifier creates new view

// Better: Extract static views
let titleText = Text("Hello").font(.title)
```

**2. Avoid expensive computations:**
```swift
struct ExpensiveView: View {
    let data: [Item]

    // Computed every render
    var sortedData: [Item] {
        data.sorted()  // ❌ Bad
    }

    // Better: Cache with @State or pass sorted
}
```

## Testing Strategies

### XCTest (Unit Testing)

```swift
import XCTest
@testable import MyApp

final class UserViewModelTests: XCTestCase {
    var viewModel: UserViewModel!
    var mockRepository: MockUserRepository!

    override func setUp() {
        super.setUp()
        mockRepository = MockUserRepository()
        viewModel = UserViewModel(repository: mockRepository)
    }

    func testLoadUsers() async throws {
        // Given
        let expectedUsers = [User(id: "1", name: "Test", email: "test@example.com")]
        mockRepository.usersToReturn = expectedUsers

        // When
        await viewModel.loadUsers()

        // Then
        XCTAssertEqual(viewModel.users, expectedUsers)
        XCTAssertFalse(viewModel.isLoading)
        XCTAssertNil(viewModel.error)
    }
}
```

### XCUITest (UI Testing)

```swift
import XCTest

final class LoginUITests: XCTestCase {
    let app = XCUIApplication()

    override func setUp() {
        super.setUp()
        app.launch()
    }

    func testLoginFlow() {
        let emailField = app.textFields["emailField"]
        emailField.tap()
        emailField.typeText("test@example.com")

        let passwordField = app.secureTextFields["passwordField"]
        passwordField.tap()
        passwordField.typeText("password123")

        app.buttons["loginButton"].tap()

        XCTAssertTrue(app.staticTexts["Welcome"].waitForExistence(timeout: 5))
    }
}
```

**Target Coverage:**
- Unit tests: 70-80%+
- Critical paths: 100%
- UI tests: Key user flows only (slow)

## iOS-Specific Features

### WidgetKit

```swift
import WidgetKit
import SwiftUI

struct SimpleWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "SimpleWidget", provider: Provider()) { entry in
            SimpleWidgetView(entry: entry)
        }
        .configurationDisplayName("My Widget")
        .description("This is my widget")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
```

### Live Activities (iOS 16.1+)

```swift
import ActivityKit

struct OrderAttributes: ActivityAttributes {
    struct ContentState: Codable, Hashable {
        var status: String
        var estimatedTime: Date
    }

    var orderId: String
}

// Start activity
let attributes = OrderAttributes(orderId: "123")
let initialState = OrderAttributes.ContentState(
    status: "Preparing",
    estimatedTime: Date().addingTimeInterval(1800)
)

let activity = try Activity.request(
    attributes: attributes,
    contentState: initialState
)
```

### App Clips

**Characteristics:**
- <10MB size limit
- Fast, lightweight experiences
- No installation required
- Invoked via NFC, QR, Safari, Maps

## Human Interface Guidelines (HIG)

### Navigation Patterns

**Tab Bar:**
- 2-5 top-level sections
- Bottom placement
- Always visible
- Immediate navigation

**Navigation Bar:**
- Hierarchical navigation
- Back button automatic
- Title and actions
- Large/inline title modes

**Modal Presentation:**
- Interrupting tasks
- Self-contained flow
- Clear dismiss action
- Use sparingly

### Design Principles

**Clarity:**
- Legible text (minimum 11pt)
- Sufficient contrast (WCAG AA)
- Precise icons

**Deference:**
- Content first, UI second
- Translucent backgrounds
- Minimal UI elements

**Depth:**
- Layering (sheets, overlays)
- Visual hierarchy
- Motion provides meaning

### Colors

**System Colors:**
```swift
Color.primary      // Adaptive black/white
Color.secondary    // Gray
Color.accentColor  // App tint color
Color(uiColor: .systemBlue)
Color(uiColor: .label)
```

**Dark Mode:**
```swift
// Automatic
Color.primary  // Adapts to light/dark

// Custom
Color("CustomColor")  // Define in Assets.xcassets
```

### SF Symbols

```swift
Image(systemName: "star.fill")
    .foregroundColor(.yellow)
    .font(.title)

// Rendering modes
Image(systemName: "heart.fill")
    .symbolRenderingMode(.multicolor)
```

## App Store Requirements (2024-2025)

### SDK Requirements
- **Current**: Xcode 15+ with iOS 17 SDK (required as of April 2024)
- **Upcoming**: Xcode 16+ with iOS 18 SDK (recommended for 2025 submissions)

### Privacy
- **Privacy manifest**: Required for third-party SDKs
- **Tracking permission**: ATT framework for advertising
- **Privacy nutrition labels**: Accurate data collection info
- **Account deletion**: In-app deletion required

### Capabilities
- **Sandbox**: All apps sandboxed
- **Entitlements**: Request only needed capabilities
- **Background modes**: Justify background usage
- **HealthKit**: Privacy-sensitive, strict review

### Submission Checklist
✅ App icons (all required sizes)
✅ Screenshots (all device sizes)
✅ App description and keywords
✅ Privacy policy URL
✅ Support URL
✅ Age rating questionnaire
✅ Export compliance
✅ Test on real devices
✅ No crashes or major bugs

## Common Pitfalls

1. **Strong reference cycles**: Use `[weak self]` in closures
2. **Main thread blocking**: Use async/await, avoid sync operations
3. **Large images**: Resize before displaying
4. **Unhandled errors**: Always handle async throws
5. **Ignoring safe areas**: Use `.ignoresSafeArea()` intentionally
6. **Not testing dark mode**: Design for both appearances
7. **Hardcoded strings**: Use localization from start
8. **Memory leaks**: Profile with Instruments regularly

## Resources

**Official:**
- Swift Documentation: https://swift.org/documentation/
- SwiftUI Tutorials: https://developer.apple.com/tutorials/swiftui
- HIG: https://developer.apple.com/design/human-interface-guidelines/
- WWDC Videos: https://developer.apple.com/videos/

**Community:**
- Hacking with Swift: https://www.hackingwithswift.com/
- Swift by Sundell: https://www.swiftbysundell.com/
- objc.io: https://www.objc.io/
- iOS Dev Weekly: https://iosdevweekly.com/


### mobile mindset

# Mobile Development Mindset & Thinking Patterns

Essential thinking patterns and decision-making frameworks for successful mobile development.

## The 10 Commandments of Mobile Development

### 1. Performance is Foundation, Not Feature
- **Reality**: 70% users abandon apps >3s load time
- **Mindset**: Optimize from day one, not "later"
- **Action**: Set performance budgets before writing code

### 2. Every Kilobyte, Every Millisecond Matters
- **Reality**: Mobile = constrained environment (battery, memory, network)
- **Mindset**: Desktop assumptions don't apply
- **Action**: Profile real devices, not simulators

### 3. Offline-First by Default
- **Reality**: Network is unreliable (elevators, tunnels, airplanes, poor signal)
- **Mindset**: Design for offline, sync when online
- **Action**: Local persistence first, cloud sync second

### 4. User Context > Developer Environment
- **Reality**: Users on trains, walking, one-handed, bright sunlight
- **Mindset**: Test in real-world scenarios
- **Action**: Real device testing mandatory

### 5. Platform Awareness Without Platform Lock-In
- **Reality**: iOS and Android users expect different patterns
- **Mindset**: Respect conventions, but keep logic portable
- **Action**: Platform-specific UI, shared business logic

### 6. Iterate, Don't Perfect (2024-2025 Survival Strategy)
- **Reality**: Mobile landscape changes rapidly
- **Mindset**: Ship, measure, improve cycle
- **Action**: MVP → User feedback → Iterate

### 7. Security and Accessibility by Design
- **Reality**: Not afterthoughts, but core requirements
- **Mindset**: Build trust and inclusivity from start
- **Action**: Security audit + accessibility testing in every sprint

### 8. Test on Real Devices
- **Reality**: Simulators lie about performance, battery, network
- **Mindset**: Simulators for speed, devices for truth
- **Action**: CI/CD with real device farms

### 9. Architecture Scales with Complexity
- **Reality**: Over-engineering kills simple apps
- **Mindset**: Start simple, refactor when needed
- **Action**: MVVM for small apps, Clean Architecture when complexity demands

### 10. Continuous Learning is Survival
- **Reality**: 85% developers use AI tools (2024), frameworks evolve constantly
- **Mindset**: Embrace change, allocate learning time
- **Action**: 1+ hour weekly for new tech/patterns

## Mobile-Specific Constraints & Thinking

### Small Screens (Constraint → Design Parameter)

**Constraint:**
- 5-7 inch screens, thumb-reach zones, fat finger problem

**Thinking Shift:**
- Embrace minimalism: "What can we remove?"
- Priority-based hierarchy: Most important action front and center
- Progressive disclosure: Hide complexity behind layers

**Practical Targets:**
- 44x44px minimum touch targets (iOS)
- 48x48px minimum touch targets (Android)
- Primary actions within thumb reach (bottom 1/3)
- Maximum 3-4 items in bottom navigation

**Example Decision:**
```
❌ Bad: 8-column data table on mobile
✅ Good: Card view with 3 key metrics, "View more" for details
```

### Limited Resources (Every KB/ms Matters)

**Constraint:**
- Battery drain, memory pressure, thermal throttling

**Thinking Shift:**
- Resource consciousness in every decision
- Measure before optimizing (don't guess)
- Graceful degradation on low-end devices

**Practical Targets:**
- <100MB memory for typical screens
- <5% battery drain per hour active use
- <50MB initial download, <200MB total
- 60 FPS (16.67ms per frame)

**Example Decision:**
```
❌ Bad: Load all 1000 items in list
✅ Good: Virtualized list (10 items visible + buffer)
```

### Intermittent Connectivity (Offline-First)

**Constraint:**
- Network unreliable: elevators, tunnels, poor signal, airplane mode

**Thinking Shift:**
- Local-first data architecture
- Optimistic UI updates
- Sync conflict resolution strategy

**Practical Approaches:**
- **Write-through cache**: Write local, sync background
- **Hybrid sync**: Push (realtime) + Pull (periodic)
- **Conflict resolution**: Last-write-wins with timestamps or CRDT

**Example Decision:**
```
❌ Bad: Show spinner while posting comment
✅ Good: Show comment immediately (optimistic), sync background, handle conflicts
```

## Platform-Specific Thinking

### iOS Mental Model

**Philosophy**: Consistent, polished, opinionated
- Users expect iOS patterns (tab bar, navigation bar, swipe back)
- Design reviews reject non-standard UIs
- "It just works" expectation = zero tolerance for crashes

**Fragmentation**: LOW
- 90%+ on iOS 16+ (2024)
- Only ~50 device models to test
- Predictable hardware specs

**Design Thinking**:
- Follow Human Interface Guidelines religiously
- Native navigation patterns non-negotiable
- Haptic feedback for important actions
- Respect safe areas (notch, Dynamic Island)

**When to Go Native iOS:**
- App Store is primary revenue channel
- Need latest Apple features (WidgetKit, Live Activities)
- Target affluent user base (iOS users spend 2.5x more)

### Android Mental Model

**Philosophy**: Flexible, customizable, democratic
- Users expect Material Design but tolerate variations
- Extreme fragmentation = defensive programming
- "Back button" = fundamental navigation expectation

**Fragmentation**: HIGH
- 24,000+ device models
- Android 6-14 in active use (8 years of OS versions)
- Wide range of hardware specs (512MB to 12GB RAM)

**Design Thinking**:
- Material Design 3 as baseline
- Test on low-end devices (1GB RAM minimum)
- Respect system navigation (gesture vs 3-button)
- Handle back button properly

**When to Go Native Android:**
- Global market focus (72% market share)
- Emerging markets (Android dominates)
- Enterprise/B2B (customization needs)

## Performance Mindset (Every Millisecond Matters)

### Critical Metrics (User Perception)

| Metric | Threshold | User Perception |
|--------|-----------|-----------------|
| **Launch time** | <2s | Acceptable |
| **Launch time** | 2-3s | Noticeable delay |
| **Launch time** | >3s | 70% abandon |
| **Screen load** | <1s | Instant (cached) |
| **Screen load** | 1-3s | Acceptable (network) |
| **Screen load** | >3s | Frustrating |
| **Animation** | 60 FPS | Smooth |
| **Animation** | 30-60 FPS | Noticeable jank |
| **Animation** | <30 FPS | Unusable |

### Performance Budget Example

**Mobile App Performance Budget:**
```
Launch Time
├─ Cold start: <2s (target 1.5s)
├─ Warm start: <1s
└─ Hot start: <0.5s

Screen Load
├─ Cached data: <500ms
├─ Network data: <2s
└─ Heavy computation: <3s

Memory
├─ Typical screen: <100MB
├─ Heavy screen (images): <150MB
└─ Peak usage: <200MB

Network
├─ Initial bundle: <2MB
├─ Per screen: <500KB
└─ Images: <200KB each

Battery
├─ Active use: <5% per hour
├─ Background: <1% per hour
└─ Idle: <0.1% per hour
```

### Optimization Decision Tree

**Is it slow?**
1. **Measure first** (Xcode Instruments, Android Profiler)
2. **Find bottleneck** (CPU, memory, network, disk I/O)
3. **Fix biggest impact** (80/20 rule)
4. **Measure again** (verify improvement)

**Common Culprits:**
- Synchronous main thread operations
- Unoptimized images (too large, wrong format)
- N+1 query problem (fetch in loop)
- Memory leaks (retain cycles, listeners)
- Re-renders without memoization

## Mobile Development Workflow

### Iterative Development Cycle (Agile)

**Sprint Structure (2 weeks):**
```
Week 1: Build + Test
├─ Day 1-2: Design + plan
├─ Day 3-4: Implement core
└─ Day 5: Code review + tests

Week 2: Polish + Ship
├─ Day 6-7: Bug fixes + polish
├─ Day 8: QA testing
├─ Day 9: Staging deployment
└─ Day 10: Production release (staged)
```

**Daily Workflow:**
1. Pull latest code
2. Run tests locally
3. Develop feature/fix
4. Write/update tests
5. Local testing on device
6. Code review
7. CI/CD validation
8. Merge to develop

**CI/CD Impact:**
- 20% reduction in development time
- 50% fewer production bugs
- 3x faster deployment

### Common Pitfalls & Avoidance

#### 1. Testing Only on Simulators
**Problem**: Simulators don't show real performance (battery, memory, network)
**Solution**: Real device testing mandatory before every release
**Impact**: 40% of bugs only appear on real devices

#### 2. Ignoring Platform Conventions
**Problem**: Custom navigation confuses users
**Solution**: Follow iOS HIG and Material Design
**Impact**: 30% lower engagement with non-standard UIs

#### 3. No Offline Handling
**Problem**: Network failures = blank screens, errors
**Solution**: Offline-first architecture, cached data
**Impact**: 50% of users experience network issues daily

#### 4. Poor Memory Management
**Problem**: Memory leaks → crashes, poor performance
**Solution**: ARC/GC understanding, profile regularly
**Impact**: Memory issues = #1 crash cause (35%)

#### 5. Hardcoded Credentials
**Problem**: Security vulnerability, API key exposure
**Solution**: Environment variables, secure storage
**Impact**: 23% of apps leak sensitive data (OWASP)

#### 6. No Accessibility
**Problem**: Excludes 15%+ of users (disability, situational)
**Solution**: VoiceOver/TalkBack testing, semantic labels
**Impact**: Accessibility = 1.3B global market

#### 7. Premature Optimization
**Problem**: Wasted time optimizing non-bottlenecks
**Solution**: Measure first, optimize biggest impact
**Impact**: 80% of performance issues = 20% of code

#### 8. Over-Engineering
**Problem**: Complex architecture for simple apps
**Solution**: Start simple, scale when needed
**Impact**: 3x longer development for no user benefit

#### 9. Skipping Real Device Testing
**Problem**: Missed battery drain, thermal issues
**Solution**: Device farm in CI/CD, manual testing
**Impact**: 25% of performance issues device-specific

#### 10. Not Respecting Battery
**Problem**: Background processing drains battery
**Solution**: Batch operations, respect Doze Mode
**Impact**: Battery drain = #1 uninstall reason

## Debugging Strategies & Tools (2024-2025)

### iOS Debugging (Xcode 16)

**Tools:**
- **Instruments**: Profiling (Time, Allocations, Leaks, Network)
- **Memory Graph**: Visual retain cycles
- **View Hierarchy**: UI debugging
- **Network Link Conditioner**: Simulate poor network
- **Console**: System logs, os_log

**AI-Driven:**
- Xcode 16 AI crash analysis
- Automatic memory leak detection
- Performance suggestions

**Process:**
1. Reproduce bug on device
2. Attach debugger / capture crash log
3. Symbolicate crash report
4. Fix root cause (not symptom)
5. Add test to prevent regression

### Android Debugging (Android Studio Giraffe+)

**Tools:**
- **Profiler**: CPU, Memory, Network, Energy
- **Layout Inspector**: 3D view hierarchy
- **Database Inspector**: SQLite/Room debugging
- **Network Inspector**: API call monitoring
- **Logcat**: System logs with filters

**AI-Driven:**
- Android Vitals: Crash clustering, ANR analysis
- Firebase Crashlytics: AI-powered issue grouping
- Play Console insights: User-reported bugs

**Process:**
1. Reproduce on emulator/device
2. Check Logcat for stack traces
3. Use Android Profiler for performance
4. Fix and verify with instrumented tests
5. Monitor Play Console vitals post-release

### Cross-Platform Debugging

**React Native:**
- Chrome DevTools / Safari Web Inspector
- Flipper (meta debugger: network, layout, logs)
- Reactotron (state inspection)

**Flutter:**
- Flutter DevTools (Inspector, Timeline, Memory, Network)
- Dart Observatory (VM debugging)
- Widget Inspector (UI debugging)

## Progressive Enhancement & Graceful Degradation

### Progressive Enhancement (Build Up)

**Strategy**: Start with baseline, enhance for capable devices

**Example: Image Loading**
```
Baseline (all devices):
├─ Show placeholder immediately
├─ Load low-res image (10KB)
└─ Display with smooth fade-in

Enhancement (modern devices):
├─ Check network (fast = high-res)
├─ Check memory (ample = cache)
└─ Progressive JPEG rendering
```

**Benefits:**
- Works on all devices
- Optimal experience on modern devices
- No user left behind

### Graceful Degradation (Strip Down)

**Strategy**: Build for best, degrade for constraints

**Example: Animation**
```
Best (flagship devices):
├─ Complex particle effects
├─ 120 FPS animations
└─ Parallax scrolling

Degraded (budget devices):
├─ Simple fade transitions
├─ 60 FPS target
└─ Disable parallax (GPU load)
```

**Detection:**
```javascript
// React Native
const isLowEndDevice =
  DeviceInfo.getTotalMemory() < 2000000000; // <2GB

if (isLowEndDevice) {
  // Disable heavy animations
  // Reduce concurrent operations
  // Lower image quality
}
```

**Benefits:**
- Optimized for all hardware tiers
- Prevents crashes on low-end devices
- Better user experience across spectrum

## Native vs Cross-Platform Decision Framework

### Decision Tree

**Q1: Do you need 100% native performance?**
- **Yes** → Native (Swift/Kotlin)
- **No** → Continue

**Q2: Is team comfortable with JavaScript?**
- **Yes** → React Native
- **No** → Continue

**Q3: Need desktop or web versions too?**
- **Yes** → Flutter
- **No** → Continue

**Q4: Complex animations or custom UI?**
- **Yes** → Flutter
- **No** → React Native (easier for standard UIs)

**Q5: Existing codebase to share?**
- **React web app** → React Native
- **No existing code** → Flutter (cleaner slate)

### Hybrid Approach (Best of Both Worlds)

**Strategy**: Cross-platform for most features, native for critical paths

**Example Architecture:**
```
React Native / Flutter (90%)
├─ UI and business logic
├─ Standard features
└─ API integration

Native Modules (10%)
├─ Performance-critical (video processing)
├─ Platform-specific (HealthKit, Android Auto)
└─ Third-party SDKs (payment, analytics)
```

**When to Use:**
- Best: Leverage cross-platform speed + native power
- Complexity: Maintain native module knowledge
- Team: Need both cross-platform and native developers

## Architecture Decision-Making

### Complexity-Based Architecture Selection

**Simple App (1-5 screens, basic CRUD)**
- **Architecture**: MVVM (no Clean Architecture)
- **State**: Local state (useState, setState)
- **Reasoning**: Over-engineering adds complexity without benefit

**Medium App (5-20 screens, moderate logic)**
- **Architecture**: MVVM with clear separation
- **State**: Global state management (Zustand, Riverpod)
- **Reasoning**: Scalability without over-engineering

**Complex App (20+ screens, enterprise logic)**
- **Architecture**: Clean Architecture (domain, data, presentation)
- **State**: Advanced state management + dependency injection
- **Reasoning**: Maintainability and testability critical

### Architecture Evolution

**Start Simple:**
```
v1.0: MVVM, local state, single module
└─ Focus: Ship fast, validate idea

v2.0: Add global state when needed
└─ Trigger: Props drilling becomes painful

v3.0: Add Clean Architecture when scaling
└─ Trigger: Team grows, features multiply

v4.0: Extract microservices if justified
└─ Trigger: Independent deployment needs
```

**Key Principle:** Refactor when pain > refactoring cost, not before

## Resources & Continuous Learning

**Weekly Learning Targets (2024-2025):**
- 1 hour: New framework features
- 30 min: Performance optimization techniques
- 30 min: Security updates (CVEs, OWASP)
- 30 min: Community articles/videos

**Top Resources:**
- iOS: Apple WWDC videos, Swift by Sundell
- Android: Android Dev Summit, Medium Android Dev
- React Native: React Native Blog, Expo Blog
- Flutter: Flutter Engage, Medium Flutter
- Mobile DevOps: Bitrise Blog, Fastlane guides

**Communities:**
- Stack Overflow (mobile tags)
- Reddit (r/iOSProgramming, r/androiddev, r/reactnative, r/FlutterDev)
- Discord (React Native, Flutter official)
- Twitter: Follow framework creators and contributors

**AI Tools (85% adoption in 2024):**
- GitHub Copilot: Code completion, boilerplate
- ChatGPT/Claude: Architecture questions, debugging
- Tabnine: Context-aware suggestions
- Average time saved: 1+ hour weekly

**Key Mindset:** Continuous learning is not optional, it's survival in mobile development




> **Note (Cursor):** Script execution sections in this skill are Claude Code only. Cursor uses the instructions above. Run `.claude/skills/install.sh` in Claude Code to enable full capabilities.
